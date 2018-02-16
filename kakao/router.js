// user router

const express = require("express")
const kakao = require("./kakao")

const router = express.Router()

// middlewares

// restful apis...
router.get('/keyboard', kakao.keyboard)   // post /keboard
router.post('/message', kakao.message)    // put /helloworld

exports.router = router
