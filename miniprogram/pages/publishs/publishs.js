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
      name:"",
      price:0,
      unit:"",
      description:"",
      link:"",
      platform:"",
      numOfPersons:0,//需要人数
      addPersons:0, //参与拼单的数量
      addIDs:[],//拼单人wx
      time:"",
      date:"",
      type:"",
      tempImg: [],
      fileIDs: [],
      campus:"",
      goodTime:"",
      goodPlace:""
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
    let that = this;
    if (!app.openid) {
      wx.showModal({
            title: '温馨提示',
            content: '该功能需要注册方可使用，是否马上去注册',
            success(res) {
                  if (res.confirm) {
                    console.log("==================去注册")
                      wx.navigateTo({
                        url: '../login/login',
                      })
                  }
            }
      })
      return false
      }
    // const that = this
    // console.log(that.data.Car.me+"==========fileIDs")
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
      console.log("==============")
      console.log(e)
      cars.add({
        data: {
          name:e.detail.value.name,
          price:e.detail.value.price,
          unit:e.detail.value.unit,
          description:e.detail.value.description,
          link:e.detail.value.link,
          platform:e.detail.value.platform,
          numOfPersons:e.detail.value.personNum,
          addPersons:0, //参与拼单的人
          addIDs:[],//拼单人wx
          type:e.detail.value.type,
          date:e.detail.value.date,
          time:e.detail.value.time,
          campus:e.detail.value.campus,
          fileIDs: this.data.fileIDs, //只有当所有的图片都上传完毕后，这个值才能被设置，但是上传文件是一个异步的操作，你不知道他们什么时候把fileid返回，所以就得用promise.all
          goodTime:"暂未发布",
          goodPlace:"暂未发布"
        }
      })
        .then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
          })
          var name = "Car.name"
         this.setData({
           [name]:""
         })
          wx.switchTab({
            url: '../index/index',
      })
        })
        .catch(error => {
          console.log(error)
        })
    })
  }
})