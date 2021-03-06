var data = {
      //云开发环境id
      env: 'car-env',
      //分享配置
      share_title: '购拼Gopin',
      share_img: '/images/poster.jpg', //可以是网络地址，本地文件路径要填绝对位置
      share_poster:'https://mmbiz.qpic.cn/mmbiz_jpg/nJPznPUZbhpA064Cl78xxvzBYTDa6O1Kl7RY1K6TerBaXcUf5AoN6x7s8q7xHgeu0Cl5qarPzE6ibbQZasWRErg/640',//必须为网络地址
      //客服联系方式
      kefu: {
            weixin: 'xuhuai66',
            qq: '1604026596',
            gzh: 'https://mmbiz.qpic.cn/mmbiz_png/nJPznPUZbhpKCwnibUUqnt7BQXr3MbNsasCfsBd0ATY8udkWPUtWjBTtiaaib6rTREWHnPYNVRZYgAesG9yjYOG7Q/640', //公众号二维码必须为网络地址
            phone: '' //如果你不设置电话客服，就留空
      },

      //校区：西土城、沙河
      campus: [{
                  name: '西土城',
                  id: 0
            },
            {
                  name: '沙河',
                  id: 1
            },
      ],
      //配置商品类名
      college: [{
                  name: '数码电器',
                  id: -1
            },
            {
                  name: 'app会员',
                  id: 0
            },
            {
                  name: '美妆护肤',
                  id: 1
            },
            {
                  name: '服饰箱包',
                  id: 2
            },
            {
                  name: '食品保健',
                  id: 3
            },
            {
                  name: '其它商品',
                  id: 3
            },
            // {
            //       name: '数统',
            //       id: 4
            // },
            // {
            //       name: '物理',
            //       id: 5
            // },
            // {
            //       name: '化工',
            //       id: 6
            // },
            // {
            //       name: '生物',
            //       id: 7
            // },
            // {
            //       name: '电气',
            //       id: 8
            // },
            // {
            //       name: '机械',
            //       id: 9
            // },
            // {
            //       name: '动力',
            //       id: 10
            // },
            // {
            //       name: '资环',
            //       id: 11
            // },
            // {
            //       name: '材料',
            //       id: 12
            // },
            // {
            //       name: '建筑',
            //       id: 13
            // },
            // {
            //       name: '其它',
            //       id: 14
            // },
      ],
}
//下面的就别动了
function formTime(creatTime) {
      let date = new Date(creatTime),
            Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
      if (M < 10) {
            M = '0' + M;
      }
      if (D < 10) {
            D = '0' + D;
      }
      if (H < 10) {
            H = '0' + H;
      }
      if (m < 10) {
            m = '0' + m;
      }
      if (s < 10) {
            s = '0' + s;
      }
      return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
}

function days() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      if (month < 10) {
            month = '0' + month;
      }
      if (day < 10) {
            day = '0' + day;
      }
      let date = year + "" + month + day;
      return date;
}

//时间差
function timeDifference(faultDate, completeTime){
var stime = Date.parse(new Date(faultDate));
var etime = Date.parse(new Date(completeTime));
var usedTime = etime - stime; //两个时间戳相差的毫秒数
var days = Math.floor(usedTime / (24 * 3600 * 1000));
//计算出小时数
var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
var hours = Math.floor(leave1 / (3600 * 1000));
//计算相差分钟数
var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
var minutes = Math.floor(leave2 / (60 * 1000));
var dayStr = days == 0 ? "" : days + "天";
var hoursStr = hours == 0 ? "" : hours + "时";
var time = dayStr + hoursStr + minutes + "分";
return time;
}

module.exports = {
      data: JSON.stringify(data),
      formTime: formTime,
      days: days,
      timeDifference:timeDifference
}