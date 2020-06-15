// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('good').where({
    _id:event._id//查找对应good数据
  }).update({
    data:{
      //'addIDs.$.num': 8889
      addPersons:event.reAddPersons,//恢复单数
      addIDs:_.pull({
        openid:_.eq(event.openid)//删除该用户拼单数据
      })
    }
  })
}