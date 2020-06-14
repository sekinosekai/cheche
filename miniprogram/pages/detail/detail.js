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
            pinRest:[],//pinker可以拼单数组
            index:0,
            pinObj:{
                  openid:"",
                  num:''
            }
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
            db.collection('Cars').doc(e).get({
                  success: function(res) {
                        that.setData({
                              // collegeName: JSON.parse(config.data).campus[parseInt(res.data.collegeid) + 1],
                              collegeName: JSON.parse(config.data).campus,
                              publishinfo: res.data,
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
                        }
                        console.log("-------------")
                        that.setData({
                              wxlist: wxlisttmp //设置用户们的id
                        })
                        console.log(wxlisttmp)
                        
                        // 判断是否为已拼单用户
                        // console.log(publishinfo.addIDs)
                        console.log("??????????????????????????")
                        console.log(publishinfo.addIDs.find((item) => (item.openid == app.openid)))
                        var addedInfo = publishinfo.addIDs.find((item) => (item.openid == app.openid))
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

      // getwx(m){
      //       let that = this;
      //       db.collection('user').where({
      //             _openid:m
      //       }).get({
      //             success: function(res) {
      //                   that.setData({
      //                         wxlist: wxlist.push(res.data[0].wxnum)
      //                   })
      //             },
      //             fail:function(res){
      //                   console.log("fail"+res)
      //             }
      //       })
      // },
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
                              console.log("=======++++++")
                              that.setData({
                                    showPin:false,
                                    showId:true,
                                    showCancel:true
                              })
                        }
                  }
            })
      },
      //获取商品信息（因为发布信息包含商品信息，这里删去）
      // getGood(e) {
      //       let that = this;
      //       db.collection('Cars').doc(e).get({
      //             success: function(res) {
      //                   that.setData({
      //                         goodinfo: res.data
      //                   })
      //             }
      //       })
      // },
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
            const _ = db.command
            // var openid
            that.setData({//设置拼单者和拼单数量对象值
                  ['pinObj.openid']:app.openid,
                  ['pinObj.num']:pinNum
            })
            var pinObj = that.data.pinObj;
            db.collection('Cars').doc(that.data.id).update({
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
                        db.collection('Cars').doc(that.data.id).get({
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
            
            // wx.cloud.callFunction({
            //       // 云函数名称
            //       name: 'pin',
            //       // 传给云函数的参数
            //       data: {
            //         name: e
            //       },
            //       success: function (res) {
            //         console.log(res)
            //       },
            //       fail: console.error
            //     })
            

            // if (that.data.publishinfo.deliveryid == 1) {
            //       if (that.data.place == '') {
            //             wx.showToast({
            //                   title: '请输入您的收货地址',
            //                   icon: 'none'
            //             })
            //             return false
            //       }
            //       that.getStatus();
            // }
            // that.getStatus();
      },

      //提交取货地
      onSubmitGood:function(e){
            console.log(e)
            let that = this;
            const _ = db.command
            db.collection('Cars').doc(that.data.id).update({
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
      wx.showModal({
            title: '取消提示',
            content: '确认要取消该拼单吗？',
            success: function (res) {
              if (res.confirm) {  
                  //发车人取消
                if(app.openid == that.data.publishinfo._openid){
                  console.log('发车人点击')
                  db.collection('Cars').doc(that.data.id).remove().then(res=>{
                        console.log("删除");
                        console.log(res)
                        wx.switchTab({
                          url: '../index/index',
                        })
                      })
                  }else{//上车用户下车
                        //找出该用户拼单数量
                        // db.collection('Cars').doc(that.data.id).get({
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
                        // wx.cloud.callFunction({
                        //       name: 'pin',
                        //       data:{
                        //         _id:that.data.id,
                        //         openid:app.openid,
                        //         num:that.addedInfo.num,//该用户单数
                        //         addPersons:addPersons//该拼单已有数量
                        //       },
                        //       complete: res => {
                        //         console.log('callFunction test result: ', res)
                        //       }
                        //     })
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
      //支付提交
      paypost() {
            let that = this;
            wx.showLoading({
                  title: '正在下单',
            });
            // 利用云开发接口，调用云函数发起订单
            wx.cloud.callFunction({
                  name: 'pay',
                  data: {
                        $url: "pay", //云函数路由参数
                        goodId: that.data.publishinfo._id
                  },
                  success: res => {
                        wx.hideLoading();
                        that.pay(res.result)
                  },
                  fail(e) {
                        wx.hideLoading();
                        wx.showToast({
                              title: '支付失败，请及时反馈或稍后再试',
                              icon: 'none'
                        })
                  }
            });
      },
      //实现小程序支付
      pay(payData) {
            let that = this;
            //官方标准的支付方法
            wx.requestPayment({
                  timeStamp: payData.timeStamp,
                  nonceStr: payData.nonceStr,
                  package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
                  signType: 'MD5',
                  paySign: payData.paySign, //签名
                  success(res) {
                        that.setStatus();
                  },
            })
      },
      //修改卖家在售状态
      setStatus() {
            let that = this
            wx.showLoading({
                  title: '正在处理',
            })
            // 利用云开发接口，调用云函数发起订单
            wx.cloud.callFunction({
                  name: 'pay',
                  data: {
                        $url: "changeP", //云函数路由参数
                        _id: that.data.publishinfo._id,
                        status: 1
                  },
                  success: res => {
                        console.log('修改订单状态成功')
                        that.creatOrder();
                  },
                  fail(e) {
                        wx.hideLoading();
                        wx.showToast({
                              title: '发生异常，请及时和管理人员联系处理',
                              icon: 'none'
                        })
                  }
            })
      },
      //创建订单
      creatOrder() {
            let that = this;
            db.collection('order').add({
                  data: {
                        creat: new Date().getTime(),
                        status: 1, //0在售；1买家已付款，但卖家未发货；2买家确认收获，交易完成；3、交易作废，退还买家钱款
                        price: that.data.publishinfo.price, //售价
                        deliveryid: that.data.publishinfo.deliveryid, //0自1配
                        ztplace: that.data.publishinfo.place, //自提时地址
                        psplace: that.data.place, //配送时买家填的地址
                        bookinfo: {
                              _id: that.data.bookinfo._id,
                              author: that.data.bookinfo.author,
                              edition: that.data.bookinfo.edition,
                              pic: that.data.bookinfo.pic,
                              title: that.data.bookinfo.title,
                        },
                        seller: that.data.publishinfo._openid,
                        sellid: that.data.publishinfo._id,
                  },
                  success(e) {
                        that.history('购买书籍', that.data.publishinfo.price, 2, e._id)
                  },
                  fail() {
                        wx.hideLoading();
                        wx.showToast({
                              title: '发生异常，请及时和管理人员联系处理',
                              icon: 'none'
                        })
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
                  title: '这本《' + this.data.bookinfo.title + '》只要￥' + this.data.publishinfo.price + '元，快来看看吧',
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
      kefuani: function() {
            let that = this;
            let i = 0
            let ii = 0
            let animationKefuData = wx.createAnimation({
                  duration: 1000,
                  timingFunction: 'ease',
            });
            animationKefuData.translateY(10).step({
                  duration: 800
            }).translateY(0).step({
                  duration: 800
            });
            that.setData({
                  animationKefuData: animationKefuData.export(),
            })
            setInterval(function() {
                  animationKefuData.translateY(20).step({
                        duration: 800
                  }).translateY(0).step({
                        duration: 800
                  });
                  that.setData({
                              animationKefuData: animationKefuData.export(),
                        })
                        ++ii;
                  //console.log(ii);
            }.bind(that), 1800);
      },
      onReady() {
            this.kefuani();
      }
})