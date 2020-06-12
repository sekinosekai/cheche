// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'car-env' 
 })
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
     console.log("==============")
  //   return await db.collection('Cars').doc(event).update({
  //     // data 传入需要局部更新的数据
  //     data: {
  //       addPersons: _.inc(1)
  //         }
  //   })
   } catch (e) {
    console.error(e)
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}