Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  keybo:function(event){
    console.log(event)
    var keyHeight = event.detail.height;
    this.setData({
      keyHeight:keyHeight
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
    inputType:false,
    pwdleng:0,
    isShow:'hide',
    totalAmount:0,
    relPrice:0,
    pub_url:'',
    openid:'',
    orderno:'',
    ani:true,
    tradepassword:'',
    keyHeight:'',
    modal_flag:'none',
    modal_message:'',
    modal_confirm:'',
    modal_cancel:'',
    modal_url:''
  },
  goTc:function(){
    wx.navigateTo({
      url: '../card-yh/card-yh'
    })
  },
  jia:function(){
    var count = this.data.count + 1;
    var price = this.data.relPrice;
    var cashPrice = this.data.cashPrice
    this.setData({
      count:count,
      totalAmount: parseInt((count * price)*10)/10,
      totalCash: parseInt((count * cashPrice) * 10) / 10
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


        if (vip == 'normal') {
          var orderamt = item.priceBean.price;
        } else {
          var orderamt = item.priceBean.vipPrice;
        }
        var total = parseInt((count * orderamt) * 10) / 10

        console.log(orderamt);
        console.log(total)

        var data = {
          terminal: 'ios',
          shopId: shopid,
          userId: userid,
          constype: 'wx',
          ticketId: item.id,
          price: orderamt,
          orderamt: total,
          num:count,
          cashPrice:'',
          totalCash:''
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
                orderno:res.data.ext.order.orderNo
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
  jian:function(){
    var count = this.data.count - 1;
    var price = this.data.relPrice;
    var cashPrice = this.data.cashPrice
    if(count <= 0){
      count = 1
    }
    this.setData({
      count:count,
      totalAmount: parseInt((count * price) * 10) / 10,
      totalCash: parseInt((count * cashPrice) * 10) / 10
    })
  },  
  cha:function(){
    this.setData({
      isShow:'hide'
    })
  },
  subPwd:function(){
    console.log(666)
    this.setData({
      focus:true,
      inputType:true
    })
    console.log(this.data.focus)
  },
  modalCancel:function(){
    this.setData({
      modal_flag:'none'
    })
    if(this.data.modal_cancel == '重新输入'){
      this.setData({
        pwdleng: 0,
        userpwd: '',
        focus: true,
        isShow: 'show'
      })
    }else{
      this.setData({
        pwdleng: 0,
        userpwd: '',
        focus: false,
        isShow: 'hide'
      })
    }
  },
  modalConfirm:function(){
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
  jdShow:function(){

    var orderamt = '';
    var vip = this.data.vip;
    var item = this.data.item;
    if (vip == 'normal') {
      orderamt = item.priceBean.goldPrice;
    } else {
      orderamt = item.priceBean.vipGoldPrice;
    }
    var count = this.data.count;
    this.setData({
      totalAmount : parseInt((orderamt * count)*10) / 10
    })

    var total = this.data.totalAmount;
    var balance = this.data.item.balance;

    if(total > balance){
      this.setData({
        modal_flag:'block',
        modal_message:'余额不足',
        modal_cancel:'取消',
        modal_confirm:'前往充值',
        modal_url: '../gold-cz/gold-cz'
      })
      return false
    }
    if (this.data.tradepassword == ''){
      this.setData({
        modal_flag: 'block',
        modal_message: '交易密码尚未设置',
        modal_cancel: '取消',
        modal_confirm: '前往设置',
        modal_url:'../set-pwd-new/set-pwd-new'
      })
      return false
    }

    this.setData({
      isShow: 'show',
      focus:true
    });

    // this.subPwd();
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
    userpwd = utilMd5.hexMD5(userpwd); 
    var vip = this.data.vip;
    var pub_url = getApp().globalData.url;

    if (vip == 'normal'){
      orderamt = item.priceBean.goldPrice;
    }else{
      orderamt = item.priceBean.vipGoldPrice;
    }

    var json = {
      "userid": userid,
      "shopid": shopid,
      "ticketid": item.id,
      "userpwd": userpwd,
      "count": count,
      "orderamt": orderamt
    }

    var data = JSON.stringify(json);
    var key_str = mobilephone + userid.substring(4,9);

    var key = fun_aes.CryptoJS.enc.Latin1.parse(key_str);

    var iv = fun_aes.CryptoJS.enc.Latin1.parse('40ccdc3b24cc11e7');
    var encrypted = fun_aes.CryptoJS.AES.encrypt(data, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    encrypted = '' + encrypted;

    wx.request({
      url: pub_url + '/toysburg/ticket/goldPay',
      method: 'GET',
      data: {
        terminal: 'android',
        userid: userid,
        mobilephone: mobilephone ,
        data: encrypted
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          wx.redirectTo({
            url: '../buy-success/buy-success?type=ticket'
          })
        }else{
          if(res.data.retCode == '111'){
            that.setData({
              modal_flag: 'block',
              modal_message: res.data.rtnMsg,
              modal_cancel: '重新输入',
              modal_confirm: '忘记密码',
              modal_url: '../set-pwd/set-pwd?state=set',
              focus:false,
              isShow: 'hide'
            })
          }else if(res.data.retCode == '333'){
            that.setData({
              modal_flag: 'block',
              modal_message: res.data.rtnMsg,
              modal_cancel: '取消',
              modal_confirm: '前往充值',
              modal_url: '../gold-cz/gold-cz',
              focus: false,
              isShow: 'hide'
            })
          }else{
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
    var pub_url = getApp().globalData.url;
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
  zhifu: function () {
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
                    url: '../buy-success/buy-success?type=ticket',
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
  onShow:function(){
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
  load: function (type,ticketid){
    var that = this;
    var userid = '';
    var shopid = '';
    var ticketid = ticketid;
    var pub_url = getApp().globalData.url;
    var openid = getApp().globalData.openid;
    this.setData({
      pub_url:pub_url,
      openid:openid
    })
    var url = pub_url + '/toysburg/ticket/getBuyDetail'
    console.log(url)
    wx.getStorage({
      key: 'user_data',
      success(res) {
        
        var json = JSON.parse(res.data);
        console.log(json)
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
            shopid: shopid,
            userid: userid,
            ticketid:ticketid
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
              // wx.setNavigationBarTitle({
              //   title: res.data.object.name
              // })
              if(vip == 'normal'){
                price = res.data.object.priceBean.goldPrice
                cashPrice = res.data.object.priceBean.price
              }else{
                price = res.data.object.priceBean.vipGoldPrice
                cashPrice = res.data.object.priceBean.vipPrice
              }
              that.setData({
                item: res.data.object,
                totalAmount:price * that.data.count,
                relPrice:price,
                cashPrice: cashPrice,
                totalCash: cashPrice * that.data.count,
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
