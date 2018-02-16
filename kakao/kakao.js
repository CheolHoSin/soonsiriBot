const nullChecker = require('../utils/nullChecker')
const foodService = require('../services/food')
const kakaoMessage = require('./message/kakaoMessage')

const MENU = require('./menu')
const TAGS = require('./tags')
const ERROR = require('./error')

var keyboardMessage = kakaoMessage.Keyboard()
keyboardMessage.type = 'buttons'
keyboardMessage.buttons = MENU

var messageMessage = kakaoMessage.Message()
messageMessage.keyboard = keyboardMessage

function keyboard(req, res) {
  res.send(keyboardMessage)
}

function message(req, res) {
  const content = req.body.content

  if (!validateContent(content)) {
    messageMessage.message.text = ERROR['not_menu']
    res.send(messageMessage)
    return
  }

  let tags = TAGS[content]

  if (nullChecker.isNull(tags)) {
    messageMessage.message.text = ERROR['not_menu']
    res.send(messageMessage)
    return
  }

  foodService.sampleOne(tags.includes, tags.excepts) // soonsiri finds food
  .then((result) => {
    if (nullChecker.isNull(result)) {
      messageMessage.message.text = ERROR['not_found']
    } else {
      messageMessage.message.text = createText(result[0].name, result[0].msg)
    }
    res.send(messageMessage)
  })
  .catch((err) => {
    messageMessage.message.text = ERROR['unknown']
    res.send(messageMessage)
  })
}

function validateContent(content) {
  if (nullChecker.isNull(content)) return false

  let menuIdx = MENU.indexOf(content)

  if (menuIdx == -1 || menuIdx >= TAGS.length) return false
  else return true
}

function createText(name, text) {
  return text + '\n[순siri 의 추천: ' + name + ']'
}

exports.keyboard = keyboard
exports.message = message
