// miniprogram/pages/test/test.js
const config = require("../../config.js");
Page({

  data: {
    inputValue: null,
  },

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