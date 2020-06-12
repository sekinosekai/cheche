// pages/release/release.js
const config = require("../../config.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    college: JSON.parse(config.data).college,
    campus: JSON.parse(config.data).campus,
    Car:{
      me:"ming",
      owner:"",
      name:"",
      price:0,
      unit:"",
      description:"",
      link:"",
      platform:"",
      numOfPersons:0,
      addPersons:0, //参与拼单的人
      addIDs:[],//拼单人wx
      time:"",
      date:"",
      type:"",
      tempImg: [],
      fileIDs: [],
      campus:"",
    },
    
  },
  uploadImgHandle: function () {
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片,临时目录
        const tempFilePaths = res.tempFilePaths
        this.setData({
          tempImg: tempFilePaths
        })
      }
    })
  },
  campusChange:function(e){
    var campus="Car.campus"
    this.setData({
      [campus]:e.detail.value
    })
  },
  typeChange:function(e){
    var type="Car.type"
    this.setData({
      [type]:e.detail.value
    })
  },
  dateChange:function(e){
    var date="Car.date"
    this.setData({
      [date]:e.detail.value
    })
  },
  timeChange:function(e){
    var time="Car.time"
    this.setData({
      [time]:e.detail.value
    })
  },
  //提交发布
  onSubmit:function(e){
    if (!app.openid) {
      wx.showModal({
            title: '温馨提示',
            content: '该功能需要注册方可使用，是否马上去注册',
            success(res) {
                  if (res.confirm) {
                        wx.navigateTo({
                              url: '/pages/login/login',
                        })
                  }
            }
      })
      return false
}
    const that = this
    console.log(that.data.Car.me+"==========fileIDs")
    const db = wx.cloud.database()
    const cars = db.collection('Cars')
    //console.log(e);
    const promiseArr = [];
    console.log("照片数量"+this.data.tempImg.length)
    //只能一张张上传 遍历临时的图片数组
    let fileID = []
    for (let i = 0; i < this.data.tempImg.length;i++) {
      let filePath = this.data.tempImg[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove,reject)=>{
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          fileID = fileID.concat(res.fileID)
          that.setData({
            fileIDs: fileID
          })
          console.log(fileID+"limian")
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }    
    Promise.all(promiseArr).then(res=>{
      cars.add({
        data: {
          owner:"XiaoMing",//call JJ！！!!!!!!!!！！！ 缓存存储用户nickname
          name:e.detail.value.name,
          price:e.detail.value.price,
          unit:e.detail.value.unit,
          description:e.detail.value.description,
          link:e.detail.value.link,
          platform:e.detail.value.platform,
          numOfPersons:e.detail.value.numOfPersons,
          addPersons:e.detail.value.addPersons, //参与拼单的人
          addIDs:e.detail.value.addIDs,//拼单人wx
          type:e.detail.value.type,
          date:e.detail.value.date,
          time:e.detail.value.time,
          campus:e.detail.value.campus,
          fileIDs: this.data.fileIDs //只有当所有的图片都上传完毕后，这个值才能被设置，但是上传文件是一个异步的操作，你不知道他们什么时候把fileid返回，所以就得用promise.all
        }
      })
        .then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
          })
          console.log("========================发布完成跳转首页")
          wx.switchTab({
            url: '../index/index',
      })
        })
        .catch(error => {
          console.log(error)
        })
    })
  
    // cars.add({
    //   data:{
    //     owner:"XiaoMing",
    //     name:e.detail.value.name,
    //     price:e.detail.value.price,
    //     description:e.detail.value.description,
    //     link:e.detail.value.link,
    //     numOfPersons:e.detail.value.numOfPersons,
    //     date:e.detail.value.date,
    //     time:e.detail.value.time
    //   }
    // }).then(res=>{
    //   console.log(res)
      
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})