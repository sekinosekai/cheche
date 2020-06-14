// miniprogram/pages/test/test.js
const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

  data: {
    inputValue: null,
  },
  numChange:function(e){
    wx.cloud.callFunction({
      name: 'pin',
      data:{
        a:1,
        b:2
      },
      complete: res => {
        console.log('callFunction test result: ', res)
      }
    })
  },
  // numChange:function(e){
  //   db.collection('test').where({
  //     'obj.openid':'11111'
  //   }).update({
  //     data:{
  //       'obj.num':5
  //     },
  //     success:function(res){
  //       console.log(res)
  //     },
  //     fail:function(res){
  //       console.log(Res)
  //     }
  //   })
  // },



  clearInputEvent: function(res) {
    this.setData({
      'inputValue': ''
    })
  },
  
  onShow:function(e){
    this.time(3);
  },

  time:function(e){
    var a = 11;
    var b = 12;
    console.log(a+""+b)
  }

})