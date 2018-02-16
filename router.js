const express = require('express')

const rootRouter = express.Router()
const kakaoRouter = require('./kakao/router')

const bodyParser = require('body-parser')

const serverConfigs = require('./settings/server_configs')

const root = require('./root')

rootRouter.use(bodyParser.json())         // body parser

rootRouter.get('/', root.root)
rootRouter.use('/kakao', kakaoRouter.router)

exports.router = rootRouter
