// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('good').where({
    _id:event._id,//查找对应good数据
    'addIDs.openid':event.openid//查找该用户拼单数量
  }).get({
    data:{
      succ
    }
  })
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}