const httpMocks = require('node-mocks-http')
const sinon = require('sinon')
const assert = require('assert')

const kakao = require('../kakao')
const MENU = require('../menu')
const ERROR = require('../error')
const foodService = require('../../services/food')
const fooddummy = require('../../dummies/fooddummy')
const arrUtil = require('../../utils/arrayUtil')
const nullChecker = require('../../utils/nullChecker')

var req, res
var sandbox

function mockupHttp() {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  })
}

function useSandbox(sandbox, service) {

  const sampleOne = (tags, excepts) => {
    return new Promise((resolve, reject) => {
      const data = fooddummy.getTaggedDummies(tags, excepts)
      const idx = Math.floor(Math.random() * data.length)

      resolve([data[idx]])
    })
  }

  sandbox.stub(service, 'sampleOne').callsFake(sampleOne)
}

function restoreSandbox() {
  sandbox.restore()
}

function validateKeyboard(keyboard) {
  if (nullChecker.isNull(keyboard)
        || nullChecker.isNull(keyboard.type)
        || nullChecker.isNullArray(keyboard.buttons)
  ) return false

  if (keyboard.type !== 'buttons') return false
  if (!arrUtil.equals(keyboard.buttons, MENU)) return false

  return true
}

function validateFoodMsg(message) {
  if (nullChecker.isNull(message)
        || nullChecker.isNull(message.message)
        || nullChecker.isNull(message.message.text)
        || !validateKeyboard(message.keyboard)
  ) return false

  return true
}

function menuTest(menuIdx, done) {
  it('should statusCode == 200 when' + MENU[menuIdx], (done) => {
    req.body.content = MENU[menuIdx]

    res.on('end', () => {
      let resData = res._getData()
      if (res.statusCode !== 200) { done(new Error('statusCode: ' + res.statusCode)); return }
      if (!validateFoodMsg(resData)) { done(new Error('invalid message')); return }

      console.log(resData.message.text)

      done()
    })

    kakao.message(req, res)

  })
}

function test() {
  describe('kakao', () => {

    beforeEach(() => {
      mockupHttp()
    })

    afterEach(() => {
      req = null
      res = null
    })

    describe('#message', () => {

      before(() => {
        sandbox = sinon.sandbox.create()
        useSandbox(sandbox, foodService)
      })

      after(() => {
        restoreSandbox()
      })

      it('should statusCode == 200 when invalid menu', (done) => {
        req.body.content = 'invalid'

        res.on('end', () => {
          let resData = res._getData()
          if (res.statusCode !== 200) { done(new Error('statusCode: ' + res.statusCode)); return }
          if (!validateFoodMsg(resData)) { done(new Error('invalid message')); return }
          if (resData.message.text !== ERROR['not_menu']) { done(new Error('unexpected text error')); return }

          done()
        })

        kakao.message(req, res)

      })

      MENU.forEach((elm, idx) => {
        menuTest(idx)
      })

    })

    describe('#message(not found food)', () => {

      before(() => {
        sandbox = sinon.sandbox.create()
        sandbox.stub(foodService, 'sampleOne').callsFake((tags, excepts) => {
          return new Promise((resolve, reject) => {
            resolve([])
          })
        })
      })

      after(() => {
        restoreSandbox()
      })

      it('should statusCode == 200 when not found food', (done) => {
        req.body.content = MENU[0]

        res.on('end', () => {
          let resData = res._getData()
          if (res.statusCode !== 200) { done(new Error('statusCode: ' + res.statusCode)); return }
          if (!validateFoodMsg(resData)) { done(new Error('invalid message')); return }
          if (resData.message.text !== ERROR['not_found']) { done(new Error('unexpected text error')); return }

          done()
        })

        kakao.message(req, res)

      })

    })

    describe('#message(server error)', () => {

      before(() => {
        sandbox = sinon.sandbox.create()
        sandbox.stub(foodService, 'sampleOne').callsFake((tags, excepts) => {
          return new Promise((resolve, reject) => {
            reject(new Error('ERROR'))
          })
        })
      })

      after(() => {
        restoreSandbox()
      })

      it('should statusCode == 200 when serve error', (done) => {
        req.body.content = MENU[0]

        res.on('end', () => {
          let resData = res._getData()
          if (res.statusCode !== 200) { done(new Error('statusCode: ' + res.statusCode)); return }
          if (!validateFoodMsg(resData)) { done(new Error('invalid message')); return }
          if (resData.message.text !== ERROR['unknown']) { done(new Error('unexpected text error')); return }

          done()
        })

        kakao.message(req, res)

      })

    })

  })
}

exports.test = test
