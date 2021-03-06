const assert = require('assert')
const database = require('./database/database')
const dbConfigs = require('./settings/db_configs_test')

const foodServiceTest = require('./services/test/foodtest')
const kakaoTest = require('./kakao/test/kakaotest')

describe('', ()=>{
  before(()=>{
    database.connect(dbConfigs, {
      onConnected: ()=>console.log('database connected at ' + Date()),
      onDisconnected: ()=>console.log('database disconnected at ' + Date()),
      onError: (err)=>console.log(err)
    })
  })

  after(()=>{
    database.disconnect()
  })

  foodServiceTest.test()
  kakaoTest.test()

})
