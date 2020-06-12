// miniprogram/pages/test/test.js
Page({

  data: {
    inputValue: null,
  },

  clearInputEvent: function(res) {
    this.setData({
      'inputValue': ''
    })
  }
})