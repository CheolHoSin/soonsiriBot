const assert = require('assert')

const foodService = require('../food')

const fooddummy = require('../../dummies/fooddummy')
const arrUtil = require('../../utils/arrayUtil')
const nullChecker = require('../../utils/nullChecker')

const checkSize = (res, size) => {
  return new Promise((resolve, reject) => {
    const resultIsNull = nullChecker.isNullArray(res)
    if (size == 0 && resultIsNull) { resolve([]); return }

    if (resultIsNull) { reject(new Error('result is null')); return }

    if (res.length == size) { resolve(res[0]); return }
    else { reject(new Error('size is ' + res.length)); return }
  })
}

const print = (res) => {
  return new Promise((resolve, reject) => {
    console.log(res)
    resolve(res)
  })
}

const includeTags = (res, tags) => {
  return new Promise((resolve, reject) => {
    if (nullChecker.isNull(res) || nullChecker.isNullArray(res.tags)) { reject(new Error('result is null')); return }

    if (arrUtil.contains(res.tags, tags)) { resolve(res); return }
    else { reject(new Error('result doesn\' contain tags')); return }
  })
}

const exceptTags = (res, excepts) => {
  return new Promise((resolve, reject) => {
    if (nullChecker.isNull(res) || nullChecker.isNullArray(res.tags)) { reject(new Error('result is null')); return }

    if (arrUtil.notContains(res.tags, excepts)) { resolve(res); return }
    else { reject(new Error('result contains some except')); return }
  })
}

function test() {
  describe('Food', () => {

    before(() => {
      return foodService.insertAll(fooddummy.getDummies())
    })

    after(() => {
      return foodService.dropCollection()
    })

    describe('#sampleOne', () => {

      it('should be find random one', () => {
        return foodService.sampleOne()
        .then((res) => checkSize(res, 1))
        .then((res) => print(res))
      })

      it('should be find random one including tags', () => {
        const tags = ['dinner', 'alcohol']
        return foodService.sampleOne(tags)
        .then((res) => checkSize(res, 1))
        .then((res) => includeTags(res, tags))
      })

      it('should be find random one excepting tags', () => {
        const excepts = ['cheap', 'night']
        return foodService.sampleOne([], excepts)
        .then((res) => checkSize(res, 1))
        .then((res) => exceptTags(res, excepts))
      })

      it('should be find random one include tags and excepts tags2', () => {
        const tags = ['dinner', 'alcohol']
        const excepts = ['expenssive', 'makgeolli']
        return foodService.sampleOne(tags, excepts)
        .then((res) => checkSize(res, 1))
        .then((res) => includeTags(res, tags))
        .then((res) => exceptTags(res, excepts))
      })

      it('should not find random one including invalid tags', () => {
        const tags = ['dinner', 'alcohol', 'invalid']
        return foodService.sampleOne(tags)
        .then((res) => checkSize(res, 0))
      })

    })
  })
}

exports.test = test
