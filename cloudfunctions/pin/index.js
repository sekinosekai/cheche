// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('test').where({
    'arr.openid':"woshiid"
  }).update({
    data:{
      'arr.$.num': 8889
    }
  })
}