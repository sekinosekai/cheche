const app = getApp()
const db = wx.cloud.database();
const config = require("../../config.js");
const _ = db.command;
Page({

      /**
       * 页面的初始数据
       */
      data: {
            first_title: true,
            place: '',
            timeDifference:"",//剩余时间
            showPin:true,//别人发布的拼单显示拼单按钮
            showId:false,
            showCancel: false, //对已参与拼单用户显示“取消拼单”     
            wxlist:[] ,//wxids
            numlist:[],//需要数量
            pinRest:[],//pinker可以拼单数组
            index:0,
            pinObj:{
                  openid:"",
                  num:''
            },
            peopleNum:0 //拼单人数
      },
      onLoad(e) {
            this.getuserdetail();
            this.data.id = e.scene;//订单编号
            this.getPublish(e.scene);
      },
      changeTitle(e) {
            let that = this;
            that.setData({
                  first_title: e.currentTarget.dataset.id
            })
      },
      //获取发布信息
      getPublish(e) {
            let that = this;
            db.collection('good').doc(e).get({
                  success: function(res) {
                        that.setData({
                              // collegeName: JSON.parse(config.data).campus[parseInt(res.data.collegeid) + 1],
                              collegeName: JSON.parse(config.data).campus,
                              publishinfo: res.data,
                              peopleNum:res.data.addIDs.length
                        })
                        // for(let oid of res.data.addIDs){
                        //       that.getwx(oid)
                        // }
                        //计算剩余截至时间
                        var publishinfo = that.data.publishinfo
                        var dateTime = that.data.publishinfo.date+" "+that.data.publishinfo.time;
                        var nowDate=config.formTime(new Date());
                        var timeDifference=config.timeDifference(nowDate,dateTime);
                         //计算剩余人数
                        var restPersons = publishinfo.numOfPersons-publishinfo.addPersons
                        that.setData({
                              timeDifference:timeDifference,
                              restPersons:restPersons
                        })
                        let pinRest = [];
                        for(var i = 1; i <= restPersons; i++){
                              pinRest.push(i)
                        }
                        that.setData({
                              pinRest:pinRest
                        })
                        if(restPersons == 0){
                              that.setData({
                                    showPin:false
                              })
                        }
                        console.log("????????????")
                        var wxlisttmp = []
                        var numlist_tmp = []
                        var addIDs = publishinfo.addIDs
                        console.log(publishinfo.addIDs)
                        for(var j = 0; j < addIDs.length; ++j) {
                              db.collection('user').where({
                                    _openid:addIDs[j].openid
                              }).get({
                                    success: function(res) {
                                          wxlisttmp.push(res.data[0].wxnum)
                                    } 
                              })
                              numlist_tmp.push(addIDs[j].num)
                        }
                        console.log("-------------")
                        that.setData({
                              wxlist: wxlisttmp, //设置用户们的id
                              numlist:numlist_tmp
                        })
                        console.log(wxlisttmp)
                        
                        // 判断是否为已拼单用户
                        // console.log(publishinfo.addIDs)
                        console.log("??????????????????????????")
                        console.log(publishinfo.addIDs.find((item) => (item.openid == app.openid)))
                        var addedInfo = publishinfo.addIDs.find((item) => (item.openid == app.openid))
                        that.setData({
                              addedInfo:addedInfo
                        })
                        if(typeof(addedInfo) != "undefined"){
                              console.log("======")
                              that.setData({
                                    showCancel:true,
                                    showPin:false
                              })
                        }
                        // that.getSeller(res.data._openid, res.data._id)
                        that.getSeller(publishinfo._openid)
                  }
            })
      },

      //获取卖家信息
      getSeller(m) {
            console.log("openid"+m)
            let that = this;
            db.collection('user').where({
                  _openid:m
            }).get({
                  success: function(res) {
                        that.setData({
                              userinfo: res.data[0]
                        })
                        // that.getGood(n)
                        
                        //判别卖家是否为使用者
                        console.log(res)
                        console.log(app.openid)

                        if(res.data[0]._openid == app.openid){
                              that.setData({
                                    showPin:false,
                                    showId:true,
                                    showCancel:true
                              })
                        }
                  }
            })
      },

      //回到首页
      home() {
            wx.switchTab({
                  url: '/pages/index/index',
            })
      },
      //复制链接
      copyTBL:function(e){
            var self=this
            wx.setClipboardData({
                  data: self.data.publishinfo.link,
                  success: function(res) {
                        // self.setData({copyTip:true}),
                  //       wx.showModal({
                  //       title: '提示',
                  //       content: '复制成功',
                  //       success: function(res) {
                  //         if (res.confirm) {
                  //           console.log('确定')
                  //         } else if (res.cancel) {
                  //           console.log('取消')
                  //         }
                  //       }
                  // })
            }
      });
      },
      //picker选择拼单数量
      pinNumChange:function(e){
            this.setData({
                  index:e.detail.value
            })
      },
      
      //购买检测
      buy(e) {
            console.log(e)
            let that = this;
            var pinNum = Number(that.data.index)+1;//本人拼单数
            var publishinfo = that.data.publishinfo;
            console.log(publishinfo)
            var addPersons =Number(that.data.publishinfo.addPersons);//已有拼单数
            var newAddPersons = addPersons+pinNum//更新拼单人数
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
            that.setData({
                  ['publishinfo.addPersons']:newAddPersons//拼单后修改页面‘已拼单人数’
            })
            const _ = db.command
            // var openid
            that.setData({//设置拼单者和拼单数量对象值
                  ['pinObj.openid']:app.openid,
                  ['pinObj.num']:pinNum
            })
            var pinObj = that.data.pinObj;
            db.collection('good').doc(that.data.id).update({
                  // data 传入需要局部更新的数据
                  data: {
                    // 人数+拼单数
                    addPersons: newAddPersons,
                    addIDs: _.push(pinObj)//插入对象【openid,num】
                  },
                  success: function(res) {
                        var rest = that.data.restPersons;
                        console.log("rest"+rest)
                        that.setData({
                              restPersons:rest-pinNum
                        })
                        console.log(that.data.restPersons)
                        if(that.data.restPersons == 0){
                              that.setData({
                                    showPin:false
                              })
                        }
                        // 判断是否为已拼单用户
                        db.collection('good').doc(that.data.id).get({
                              success: function(res) {
                                    // that.setData({
                                    //       addIDs: res.data.addIDs
                                    // })
                                    var addIDs = res.data.addIDs
                                    console.log("=========")
                                    console.log(res.data.addIDs)
                                    console.log(addIDs.find((item) => (item.openid == app.openid)))
                                    var addedInfo = addIDs.find((item) => (item.openid == app.openid))
                                    if(typeof(addedInfo) != "undefined"){
                                          console.log("======")
                                          that.setData({
                                                showCancel:true,
                                                showPin:false
                                          })
                                    }
                              }
                        })
                      }
            })
            that.getPublish(that.data.id)
            
      },

      checkPeople:function(e){
            console.log('拼单人详情显示')
            let that = this;
            var wxlist = that.data.wxlist;
            var numlist = that.data.numlist;
            var content = ""
            var row =""
            if(wxlist.length == 0){
                  content="暂无用户拼单"
            }else{
                  for (var i = 0; i < wxlist.length; ++i) {
                        row = "wxid: "+wxlist[i]+" ("+ numlist+") ;"
                        content += row
                  }
                     
            } 
            console.log(row)
            console.log(content)
            wx.showModal({
                  title: '拼单人微信号（数量）',
                  content: content,
                  showCancel: false,
                  success: function (res) {
                        console.log("点击确认")
                  }
            })
            },

      //提交取货地
      onSubmitGood:function(e){
            console.log(e)
            let that = this;
            const _ = db.command
            db.collection('good').doc(that.data.id).update({
                  // data 传入需要局部更新的数据
                  data: {
                    // 人数+1
                    goodTime: e.detail.value.goodTime,
                    goodPlace: e.detail.value.goodPlace
                  },
                  success: function(res) {
                        console.log("修改成功")
                      }
            })
          },

      //取消拼单
      cancelBtn:function(e){
      console.log('quxiao')
      let that = this;
      var addPersons = that.data.publishinfo.addPersons;//该拼单已有人数
      console.log("addPersons:"+addPersons)
      wx.showModal({
            title: '提示',
            content: '确认要取消该拼单吗？',
            success: function (res) {
              if (res.confirm) {  
                  //发车人取消
                if(app.openid == that.data.publishinfo._openid){
                  console.log('发车人点击')
                  db.collection('good').doc(that.data.id).remove().then(res=>{
                        console.log("删除");
                        console.log(res)
                        wx.switchTab({
                          url: '../index/index',
                        })
                      })
                  }else{//上车用户下车
                        //找出该用户拼单数量
                        // db.collection('good').doc(that.data.id).get({
                        //       success:function(e){
                        //             var addIDs = res.data.addIDs
                        //             var addedInfo = addIDs.find((item) => (item.openid == app.openid)) 
                        //             console.log("!!!!!!!!!!!!!!!!!!!")
                        //             console.log(addedInfo.openid+" "+addedInfo.num)
                        //             var num = addedInfo.num;//该用户拼单数量
                        //             that.setData({
                        //                   addedInfo:addedInfo 
                        //              })
                        //       }
                        // })     
                        //取消拼单
                        // that.setData({
                        //      restPersons:addPersons+that.data.addedInfo.num 
                        // })
                        var pinObj = that.data.pinObj//取出用户拼单数量
                        var reAddPersons="";
                        var num = ""//该用户拼单书
                        if(that.data.addedInfo){
                              num = that.data.addedInfo.num
                              reAddPersons = that.data.publishinfo.addPersons-num
                        }else{
                              num = pinObj.num;
                              reAddPersons = that.data.publishinfo.addPersons-num;//恢复拼单前的拼单人书
                        }  
                        console.log("reAddPersons:"+reAddPersons)
                        that.setData({
                              restPersons:that.data.restPersons+num//恢复剩余数量
                        })
                        wx.cloud.callFunction({
                              name: 'pin',
                              data:{
                                _id:that.data.id,
                                openid:app.openid,
                                reAddPersons:reAddPersons
                              },
                              complete: res => {
                                console.log('callFunction test result: ', res)
                                that.setData({
                                      showCancel:false,
                                      showPin:true
                                })
                              }
                            })
                            wx.navigateBack()
                   }
            } else {   
                console.log('点击取消回调')
              }
            }
          })
     
      //上车人下车
      },

      //获取订单状态
      getStatus() {
            let that = this;
            let _id = that.data.publishinfo._id;
            db.collection('publish').doc(_id).get({
                  success(e) {
                        if (e.data.status == 0) {
                              that.paypost();
                        } else {
                              wx.showToast({
                                    title: '该书刚刚被抢光了~',
                                    icon: 'none'
                              })
                        }
                  }
            })
      },

      //路由
      go(e) {
            wx.navigateTo({
                  url: e.currentTarget.dataset.go,
            })
      },
      //地址输入
      placeInput(e) {
            this.data.place = e.detail.value
      },
      onShareAppMessage() {
            return {
                  title: + this.data.publishinfo.title + '只要￥' + this.data.publishinfo.price + '，快来看看吧',
                  path: '/pages/detail/detail?scene=' + this.data.publishinfo._id,
            }
      },
      //历史记录
      //记录两次，一次相当于使用微信支付充值，一次是用于购买书籍付款
      history(name, num, type, id) {
            let that = this;
            db.collection('history').add({
                  data: {
                        stamp: new Date().getTime(),
                        type: 1, //1充值2支付
                        name: '微信支付',
                        num: num,
                        oid: app.openid,
                  },
                  success: function(res) {
                        db.collection('history').add({
                              data: {
                                    stamp: new Date().getTime(),
                                    type: type, //1充值2支付
                                    name: name,
                                    num: num,
                                    oid: app.openid,
                              },
                              success: function(res) {
                                    wx.hideLoading();
                                    that.sms();
                                    that.tip();
                                    wx.redirectTo({
                                          url: '/pages/success/success?id=' + id,
                                    })
                              }
                        })
                  },
            })
      },
      //短信提醒
      sms() {
            let that = this;
            wx.cloud.callFunction({
                  name: 'sms',
                  data: {
                        mobile: that.data.userinfo.phone,
                        title: that.data.bookinfo.title,
                  },
                  success: res => {
                        console.log(res)
                  },
            })
      },
      //邮件提醒收货
      tip() {
            let that = this;
            wx.cloud.callFunction({
                  name: 'email',
                  data: {
                        type: 1, //1下单提醒2提醒收货
                        email: that.data.userinfo.email,
                        title: that.data.bookinfo.title,
                  },
                  success: res => {
                        console.log(res)
                  },
            })
      },
      //为了数据安全可靠，每次进入获取一次用户信息
      getuserdetail() {
            if (!app.openid) {
                  wx.cloud.callFunction({
                        name: 'regist', // 对应云函数名
                        data: {
                              $url: "getid", //云函数路由参数
                        },
                        success: re => {
                              db.collection('user').where({
                                    _openid: re.result
                              }).get({
                                    success: function(res) {
                                          if (res.data.length !== 0) {
                                                app.openid = re.result;
                                                app.userinfo = res.data[0];
                                                console.log(app)
                                          }
                                          console.log(res)
                                    }
                              })
                        }
                  })
            }
      },
      //生成海报
      creatPoster() {
            let that = this;
            let pubInfo = {
                  id: that.data.publishinfo._id,
                  name: that.data.publishinfo.bookinfo.title,
                  pic: that.data.publishinfo.bookinfo.pic.replace('http', 'https'),
                  origin: that.data.publishinfo.bookinfo.price,
                  now: that.data.publishinfo.price,
            }
            wx.navigateTo({
                  url: "/pages/poster/poster?bookinfo=" + JSON.stringify(pubInfo)
            })
      },
      //客服跳动动画
      // kefuani: function() {
      //       let that = this;
      //       let i = 0
      //       let ii = 0
      //       let animationKefuData = wx.createAnimation({
      //             duration: 1000,
      //             timingFunction: 'ease',
      //       });
      //       animationKefuData.translateY(10).step({
      //             duration: 800
      //       }).translateY(0).step({
      //             duration: 800
      //       });
      //       that.setData({
      //             animationKefuData: animationKefuData.export(),
      //       })
      //       setInterval(function() {
      //             animationKefuData.translateY(20).step({
      //                   duration: 800
      //             }).translateY(0).step({
      //                   duration: 800
      //             });
      //             that.setData({
      //                         animationKefuData: animationKefuData.export(),
      //                   })
      //                   ++ii;
      //             //console.log(ii);
      //       }.bind(that), 1800);
      // },
      // onReady() {
      //       this.kefuani();
      // }
})