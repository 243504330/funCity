Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  keybo: function (event) {
    console.log(event)
    var keyHeight = event.detail.height;
    this.setData({
      keyHeight: keyHeight
    })
  },
  modalCancel: function () {
    this.setData({
      modal_flag: 'none'
    })
    if (this.data.modal_cancel == '重新输入') {
      this.setData({
        pwdleng: 0,
        userpwd: '',
        focus: true,
        isShow: 'show'
      })
    } else {
      this.setData({
        pwdleng: 0,
        userpwd: '',
        focus: false,
        isShow: 'hide'
      })
    }
  },
  modalConfirm: function () {
    this.setData({
      modal_flag: 'none',
      pwdleng: 0,
      userpwd: '',
      focus: false,
      isShow: 'hide'
    })
    var url = this.data.modal_url;
    if (this.data.modal_confirm == '确认') {
      return false
    }
    wx.navigateTo({
      url: url
    })
  },
  data:{
    list:'',
    banners:'',
    item:'',
    userid:'',
    shopid:'',
    vip:'',
    mobilephone:'',
    count:1,
    userpwd:'',
    focus:false,
    pwdleng:0,
    isShow:'hide',
    totalAmount:0,
    relPrice:0,
    pub_url:'',
    cashTotal:'',
    cashPrice:'',
    tradepassword:'',
    sing:'',
    keyHeight:'',
    modal_flag: 'none',
    modal_message: '',
    modal_confirm: '',
    modal_cancel: '',
    modal_url: ''
  },
  jia:function(){
    var count = this.data.count + 1;
    var price = this.data.relPrice;
    var cashPrice = this.data.cashPrice;
    this.setData({
      count: count,
      totalAmount: parseInt((count * price) * 10) / 10,
      cashTotal: parseInt((count * cashPrice) * 10) / 10
    })
  },
  jian:function(){
    var count = this.data.count - 1;
    var price = this.data.relPrice;
    if(count <= 0){
      count = 1
    }
    var cashPrice = this.data.cashPrice;
    this.setData({
      count: count,
      totalAmount: parseInt((count * price) * 10) / 10,
      cashTotal: parseInt((count * cashPrice) * 10) / 10
    })
  },  
  chongzhi: function () {
    var that = this
    var pub_url = this.data.pub_url
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        var shopid = json.shopid;
        var userid = json.id;
        var phone = json.mobilePhone;

        var vip = that.data.vip;
        var item = that.data.item;
        var count = that.data.count;
        var type = that.data.type;

        item = item.card;

        if (vip == 'normal') {
          var orderamt = item.priceBean.price;
        } else {
          var orderamt = item.priceBean.vipPrice;
        }
        var total = parseInt((count * orderamt) * 10) / 10

        var data = {
          terminal: 'ios',
          shopId: shopid,
          userId: userid,
          constype: 'wx',
          cardId: item.id,
          price: orderamt,
          orderamt: total,
          num: count
        };
        wx.request({
          url: pub_url + '/toysburg/BuyReadBook/createBooksOrder',
          method: 'GET',
          data: data,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              console.log(res)
              that.setData({
                orderno: res.data.ext.order.orderNo
              })
              that.zhifu()
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
  zhifu: function () {
    var that = this
    var pub_url = this.data.pub_url;
    var time = '' + new Date().getTime();
 
    var cardId = this.data.item.card.id;
    var sing = this.data.sing;

    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var orderno = that.data.orderno;
        var openid = getApp().globalData.openid;

        var arr = {
          'terminal': 'ios',
          'orderno': orderno,
          'spbill_create_ip': '192.168.1.1',
          'openid': openid
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

            if (res.data.retCode == '000') {
              wx.requestPayment({
                timeStamp: res.data.timestamp,
                nonceStr: res.data.nonce_str,
                package: 'prepay_id=' + res.data.prepay_id,
                signType: 'MD5',
                paySign: res.data.sign,
                success(res) {
                  wx.redirectTo({
                    url: '../buy-success/buy-success?type=card&id=' + cardId + '&sing=' + sing
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
  cha:function(){
    this.setData({
      isShow:'hide'
    })
  },
  subPwd:function(){
    this.setData({
      focus:true
    })
  },
  jdShow:function(){

    var orderamt = '';
    var vip = this.data.vip;
    var item = this.data.item;
    if (vip == 'normal') {
      orderamt = item.card.priceBean.goldPrice;
    } else {
      orderamt = item.card.priceBean.vipGoldPrice;
    }
    var count = this.data.count;
    this.setData({
      totalAmount : parseInt((orderamt * count)*10) / 10
    })
    var total = this.data.totalAmount;
    var balance = this.data.item.sumgold;

    if (total > balance) {
      this.setData({
        modal_flag: 'block',
        modal_message: '余额不足',
        modal_cancel: '取消',
        modal_confirm: '前往充值',
        modal_url: '../gold-cz/gold-cz'
      })
      return false
    }
    if (this.data.tradepassword == '') {
      this.setData({
        modal_flag: 'block',
        modal_message: '交易密码尚未设置',
        modal_cancel: '取消',
        modal_confirm: '前往设置',
        modal_url: '../set-pwd-new/set-pwd-new'
      })
      return false
    }

    this.setData({
      isShow: 'show'
    });
    this.subPwd();
  },
  userpwd:function(event){
    var userpwd = event.detail.value;
    this.setData({
      pwdleng:userpwd.length,
      userpwd: userpwd
    })
    if(userpwd.length == 6){
      this.jdPay();
    }
  },
  jdPay:function(){
    var fun_aes = require('../../../../util/aes.js');
    var utilMd5 = require('../../../../util/md5.js');
    
    var that = this;
    var item = this.data.item;
    var userid = this.data.userid;
    var shopid = this.data.shopid;
    var count = this.data.count;
    var orderamt = '';
    var mobilephone = this.data.mobilephone;
    var userpwd = this.data.userpwd;
    userpwd = userpwd; 
    var vip = this.data.vip;

    if (vip == 'normal'){
      orderamt = item.card.priceBean.goldPrice;
    }else{
      orderamt = item.card.priceBean.vipGoldPrice;
    }

    var json = {
      "shopId": shopid,
      "cardId": item.card.id,
      "userPwd": userpwd,
      "price": orderamt
    }

    var data = JSON.stringify(json);
    var key_str = mobilephone + userid.substring(4,9);
    var key = fun_aes.CryptoJS.enc.Latin1.parse(key_str);
    var iv = fun_aes.CryptoJS.enc.Latin1.parse('40ccdc3b24cc11e7');
    var encrypted = fun_aes.CryptoJS.AES.encrypt(data, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    encrypted = '' + encrypted;
    var pub_url = this.data.pub_url;

    wx.request({
      url: pub_url + '/toysburg/buyZone/buyCard',
      method: 'GET',
      data: {
        terminal: 'android',
        userinfoid: userid,
        mobilephone: mobilephone ,
        data: encrypted
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          var cardId = res.data.ext.card.id;
          var sing = that.data.sing;

          wx.redirectTo({
            url: '../buy-success/buy-success?type=card&id=' + cardId + '&sing=' + sing
          })
        } else {
          if (res.data.retCode == '111') {
            that.setData({
              modal_flag: 'block',
              modal_message: res.data.rtnMsg,
              modal_cancel: '重新输入',
              modal_confirm: '忘记密码',
              modal_url: '../set-pwd/set-pwd?state=set',
              focus: false,
              isShow: 'hide'
            })
          } else if (res.data.retCode == '333') {
            that.setData({
              modal_flag: 'block',
              modal_message: res.data.rtnMsg,
              modal_cancel: '取消',
              modal_confirm: '前往充值',
              modal_url: '../gold-cz/gold-cz',
              focus: false,
              isShow: 'hide'
            })
          } else{
            that.setData({
              modal_flag: 'block',
              modal_message: res.data.rtnMsg,
              modal_cancel: '取消',
              modal_confirm: '确认',
              modal_url: '',
              focus: false,
              isShow: 'hide'
            })
          }
        }
      },
      fail(error) {
        console.log(error)
      }
    })

  },
  checkVip(userid){
    var userid = userid;
    var that = this;
    var pub_url = this.data.pub_url;
    wx.request({
      url: pub_url + '/toysburg/user/getVip',
      method: 'GET',
      data: {
        terminal: 'android',
        userid: userid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            vip:res.data.ext.vip
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
  goOrderDetai(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../xf-order-detai/xf-order-detai?id='+id
    })
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onShow: function () {
    var that = this;
    var pub_url = this.data.pub_url;

    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userid = json.id;
        var shopid = json.shopid;
        wx.request({
          url: pub_url + '/toysburg/user/searchMyInfo',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userid,
            shopId: shopid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.setData({
                tradepassword: res.data.ext.myWalletBean.appUserInfo.tradepassword
              })
            } else {

            }
          },
          fail(error) {

          }
        })
      }
    })
  },
  onLoad: function (event) {
    var ticketid = event.id;
    var that = this;
    var type = 'selectTicketList';
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.load(type,ticketid);
  },
  selectType:function(options){
    var type = options.currentTarget.id;
    this.load(type);
  },
  load: function (type,ticketid){
    var that = this;
    var userid = '';
    var shopid = '';
    var ticketid = ticketid;
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url:pub_url
    })
    var url = pub_url + '/toysburg/buyZone/checkBuyCard'
    console.log(url)
    wx.getStorage({
      key: 'user_data',
      success(res) {
        console.log(res)
        var json = JSON.parse(res.data);
        var mobilephone = json.mobilephone;
        userid = json.id;
        shopid = json.shopid;
        that.setData({
          userid:userid,
          shopid:shopid,
          mobilephone: mobilephone,
          tradepassword: json.tradepassword
        })
        that.checkVip(userid);
        wx.request({
          url: url,
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: userid,
            cardId:ticketid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var vip = that.data.vip;
              var price = '';
              var cashPrice = '';
              if(vip == 'normal'){
                price = res.data.ext.card.priceBean.goldPrice
                cashPrice = res.data.ext.card.priceBean.price
              }else{
                price = res.data.ext.card.priceBean.vipGoldPrice
                cashPrice = res.data.ext.card.priceBean.vipPrice
              }
              that.setData({
                item: res.data.ext,
                totalAmount:price * that.data.count,
                relPrice:price,
                cashPrice:cashPrice,
                cashTotal:cashPrice * that.data.count,
                sing:res.data.ext.card.type
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
