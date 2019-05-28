Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  formSubmit(e){
    console.log(e);
  },
  data:{
    pub_url:'',
    openid:'',
    orderList:'',
    choseid:1,
    key:1,
    result:'',
    hm_notice:'',
    notice:''
  },
  goOrderDetai(event){

  },
  goOther(){
    var url = this.data.url
    wx.navigateTo({
      url:url
    })
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  getOpenId:function(){
    var that = this;
    var pub_url = getApp().globalData.url;
    wx.login({
      success(ress) {
        var code = ress.code

        wx.getStorage({
          key: 'user_data',
          success(res) {
            var json = JSON.parse(res.data);

            wx.request({
              url: pub_url + '/toysburg/MiniProgramPay/getOpenId',
              method: 'GET',
              data: {
                terminal: 'ios',
                code:code
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                var data = JSON.parse(res.data.object);
                console.log(data.openid)
                if (res.data.retCode == '000') {
                  that.setData({
                    openid:data.openid
                  })
                } else {

                }
              },
              fail(error) {
                console.log(error)
              }
            })
          },
          fail(err) {

          }
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url:pub_url
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.getOpenId();
    this.load();
  },
  zhifu:function(){
    var that = this
    var pub_url = this.data.pub_url;
    var time = '' + new Date().getTime();
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var orderno = that.data.orderno;
        var openid = that.data.openid;

        var arr = {
          'terminal':'ios',
          'orderno':orderno,
          'spbill_create_ip':'192.168.1.1',
          'openid':openid
        }

        wx.request({
          url: pub_url + '/toysburg/MiniProgramPay/getSignMiniP',
          method: 'GET',
          data: {
            terminal: 'ios',
            orderno: orderno,
            spbill_create_ip: '192.168.1.1',
            openid: openid,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              wx.requestPayment({
                timeStamp: res.data.timestamp,
                nonceStr: res.data.nonce_str,
                package: 'prepay_id=' + res.data.prepay_id,
                signType: 'MD5',
                paySign: res.data.sign,
                success(res) {
                  wx.redirectTo({
                    url: '../buy-success/buy-success?type=jdcz',
                  })
                 },
                fail(res) { 
                  console.log(res)
                  console.log('支付失败')
                }
              })

            } else {
              wx.showToast({
                title: res.data.rtnMsg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail(error) {
            console.log(error)
          }
        })
      },
      fail(err) {

      }
    })
  },
  chongzhi:function(){
    var that = this
    var pub_url = this.data.pub_url
    var key = this.data.key;
    var orderList = this.data.orderList;
    orderList = orderList[key];
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        var shopid = json.shopid;
        var userid = json.id;
        var phone = json.mobilePhone;
        var data = {
          terminal: 'ios',
          shopId: shopid,
          userId: userid,
          goldnum: orderList.goldNum,
          price: orderList.rechargeAmount,
          rechargeid: orderList.id,
          constype: 'wx'
        };
        var rechargeLargess = orderList.rechargeLargess;
        console.log(rechargeLargess.length)
        for (var i = 0; i < rechargeLargess.length ; i++){
          console.log(rechargeLargess[i])
          var key = rechargeLargess[i].id;
          var val = rechargeLargess[i].number;
          console.log(val)
          data[key] = val;
        }

        wx.request({
          url: pub_url + '/toysburg/BuyGoldCoin/goldenBeanOrder',
          method: 'GET',
          data: data,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
    
            if (res.data.retCode == '000') {
              console.log(res)
              that.setData({
                orderno: res.data.ext.order.orderNo
              })

              that.zhifu();

            } else {
              wx.showToast({
                title: res.data.rtnMsg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail(error) {
            console.log(error)
          }
        })
      },
      fail(err) {

      }
    })
  },
  choseTc:function(options){
    var choseid = options.currentTarget.id;
    console.log(options)
    var key = options.currentTarget.dataset.key;
    console.log(key)
    this.setData({
      choseid: choseid,
      key:key
    })
  },
  load:function(){
    var that = this
    var pub_url = this.data.pub_url
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var shopid = json.shopid;
        var userid = json.id;
        wx.request({
          url: pub_url + '/toysburg/BuyGoldCoin/payIndex',
          method: 'GET',
          data: {
            terminal: 'ios',
            shopId: shopid,
            userId: userid,
            isIos:'N'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              var orderList = res.data.data;
              var notice = '';
              var hm_notice = '';
              if(res.data.ext.notice != ''){
                var extNotice = res.data.ext.notice;
                notice = extNotice.substring(0, extNotice.length - 7)
                hm_notice = extNotice.substring(extNotice.length - 7, extNotice.length)
                console.log(hm_notice)
              }
              that.setData({
                orderList: orderList,
                choseid:orderList[1].id,
                result:res.data,
                notice: notice,
                hm_notice: hm_notice
              })

            } else {
              wx.showToast({
                title: res.data.rtnMsg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail(error) {
            console.log(error)
          }
        })
      },
      fail(err) {

      }
    })
  }
})
