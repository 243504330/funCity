Page({
  goLiuShui() {
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var formId = e.detail.formId;

    this.setData({
      formId: formId
    })
    var type = e.detail.target.dataset.type;
    if(type == 'yue'){
      this.jdShow();
    }else{
      this.chongzhi();
    }
  },
  keybo: function (event) {
    console.log(event)
    var keyHeight = event.detail.height;
    this.setData({
      keyHeight: keyHeight
    })
  },
  data: {
    list: '',
    banners: '',
    item: '',
    userid: '',
    shopid: '',
    vip: '',
    mobilephone: '',
    count: 1,
    userpwd: '',
    focus: false,
    pwdleng: 0,
    isShow: 'hide',
    totalAmount: 0,
    relPrice: 0,
    info: '',
    orderamt: '',
    type: '',
    pub_url: '',
    cashTotal: '',
    orderno: '',
    tradepassword: '',
    formId:'',
    jiesao:'hide',
    modal_flag: 'none',
    modal_message: '',
    modal_confirm: '',
    modal_cancel: '',
    modal_url: ''
  },
  wenhao:function(){
    this.setData({
      jiesao: 'show'
    })
  },
  jsCha:function(){
    this.setData({
      jiesao:'hide'
    })
  },
  jia: function () {
    var count = parseInt(this.data.count) + 1;
    console.log(count)
    var price = this.data.orderamt;
    var cashPrice = this.data.cashPrice;
    this.setData({
      count: count,
      totalAmount: parseInt((count * price) * 10) / 10,
      cashTotal: parseInt((count * cashPrice) * 10) / 10
    })
  },
  jian: function () {
    var count = parseInt(this.data.count) - 1;
    var price = this.data.orderamt;
    if (count <= 0) {
      count = 1
    }
    var cashPrice = this.data.cashPrice;
    this.setData({
      count: count,
      totalAmount: parseInt((count * price) * 10) / 10,
      cashTotal: parseInt((count * cashPrice) * 10) / 10
    })
  },
  cha: function () {
    this.setData({
      isShow: 'hide'
    })
  },
  subPwd: function () {
    this.setData({
      focus: true
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
  jdShow: function () {

    var orderamt = '';
    var vip = this.data.vip;
    var item = this.data.item;
    if (vip == 'normal') {
      orderamt = item.priceBean.goldPrice;
    } else {
      orderamt = item.priceBean.vipGoldPrice;
    }
    var type = this.data.type;

    if (type == 'rent') {
      orderamt = item.priceBean.goldDeposit
    }

    var count = this.data.count;
    this.setData({
      totalAmount: parseInt((orderamt * count) * 10) / 10
    })

    var total = this.data.totalAmount;

    var balance = this.data.info.sumgold;

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
  userpwd: function (event) {
    var userpwd = event.detail.value;
    this.setData({
      pwdleng: userpwd.length,
      userpwd: userpwd
    })
    if (userpwd.length == 6) {
      this.jdPay();
    }
  },
  wjJdPay: function () {
    var userid = this.data.userid;
    var shopid = this.data.shopid;
    var num = this.data.count;
    var type = this.data.type;
    var userpwd = this.data.userpwd;
    var orderamt = this.data.orderamt;
    var toyid = this.data.item.toyId;
    var pub_url = getApp().globalData.url;
    //userId：用户ID
    //shopId：商店ID
    // quantity：数量
    // toyId: 玩具ID
    // type: rent租buy买
    //userPwd: 交易密码
    //price: 当前售价

    wx.request({
      url: pub_url + '/toysburg/sharingToys/rentToys',
      method: 'GET',
      data: {
        terminal: 'android',
        userId: userid,
        shopId: shopid,
        quantity: num,
        type: type,
        toyId: toyid,
        userPwd: userpwd,
        price: orderamt
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {

        } else {

        }
      }
    })
  },
  jdPay: function () {
    var fun_aes = require('../../../../util/aes.js');
    var utilMd5 = require('../../../../util/md5.js');

    var that = this;
    var userid = this.data.userid;
    var shopid = this.data.shopid;
    var num = this.data.count;
    var type = this.data.type;
    var userpwd = this.data.userpwd;
    var orderamt = this.data.orderamt;
    var toyid = this.data.item.toyId;
    var mobilephone = this.data.mobilephone;
    var userpwd = this.data.userpwd;
    // userpwd = utilMd5.hexMD5(userpwd); 
    var vip = this.data.vip;
    var openId = getApp().globalData.openid;
    var formId = this.data.formId;

    console.log(openId);
    console.log(formId);

    var json = {
      "shopId": shopid,
      "quantity": num,
      "userPwd": userpwd,
      "toyId": toyid,
      "type": type,
      "openId": openId,
      "formId": formId
    }

  console.log(json)


    var data = JSON.stringify(json);
    var key_str = mobilephone + userid.substring(4, 9);

    var key = fun_aes.CryptoJS.enc.Latin1.parse(key_str);

    var iv = fun_aes.CryptoJS.enc.Latin1.parse('40ccdc3b24cc11e7');
    var encrypted = fun_aes.CryptoJS.AES.encrypt(data, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    encrypted = '' + encrypted;

    var pub_url = getApp().globalData.url;

    wx.request({
      url: pub_url + '/toysburg/sharingToys/rentToys',
      method: 'GET',
      data: {
        terminal: 'android',
        userId: userid,
        mobilephone: mobilephone,
        data: encrypted,
        version: '1.0.0'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {

          wx.redirectTo({
            url: '../buy-success/buy-success?type=wj' + type
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
          } else {
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
        var openId = getApp().globalData.openid;
        var formId = this.data.formId;

        if (vip == 'normal') {
          var orderamt = item.priceBean.goldDeposit;
        } else {
          var orderamt = item.priceBean.deposit;
        }
        var total = parseInt((count * orderamt) * 10) / 10

        if (type == 'buy') {
          var data = {
            terminal: 'ios',
            shopId: shopid,
            userId: userid,
            constype: 'wx',
            toyId: item.id,
            price: orderamt,
            orderamt: total,
            num: count,
            type: type,
            openId:openId,
            formId:formId
          };

          wx.request({
            url: pub_url + '/toysburg/BuyToys/buyToyOrder',
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
        } else {
          var all = (parseFloat(orderamt)) * parseFloat(count);
          var rentPrice = parseFloat(that.data.rentPrice);
          console.log(rentPrice);

          var data = {
            terminal: 'ios',
            shopId: shopid,
            quantity: count,
            toyId: item.id,
            consType: 'wx',
            type: type,
            price: parseFloat(all),
            rentPrice: rentPrice,
            userId: userid,
            formId:formId,
            openId:openId
          };
          wx.request({
            url: pub_url + '/toysburg/sharingToys/priceRentToys',
            method: 'GET',
            data: data,
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {

              if (res.data.retCode == '000') {
                console.log(res)
                that.setData({
                  orderno: res.data.object.orderNo
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
        }


      },
      fail(err) {

      }
    })
  },
  zhifu: function () {
    var that = this
    var pub_url = this.data.pub_url;
    var time = '' + new Date().getTime();
    var type = this.data.type;
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

        console.log(arr)

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
                    url: '../buy-success/buy-success?type=wj' + type,
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
  checkVip(userid) {
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
            vip: res.data.ext.vip
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
  goOrderDetai(event) {
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../xf-order-detai/xf-order-detai?id=' + id
    })
  },
  goCoinSend() {
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onLoad: function (event) {
    var that = this;
    var type = event.type;
    var id = event.id;
    var num = event.quantity;
    var pub_url = getApp().globalData.url;

    if (type == 'rent') {
      var title = '体验区（租）'
    } else {
      var title = '体验区（买）'
    }

    wx.setNavigationBarTitle({
      title: title
    })

    this.setData({
      type: type,
      pub_url: pub_url
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var mobilephone = json.mobilephone;
        that.setData({
          tradepassword: json.tradepassword
        })
        that.checkVip(userinfoid);
        wx.request({
          url: pub_url + '/toysburg/sharingToys/toysDetermineOrder',
          method: 'GET',
          data: {
            terminal: 'android',
            type: type,
            shopId: shopid,
            userId: userinfoid,
            id: id,
            quantity: num
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            console.log(that.data.vip);
            var vip = that.data.vip;
            var orderamt = '';
            var cashPrice = '';
            var deMoney = '';
            var rentPrice = ''
            if (res.data.retCode == '000') {

              if (vip == 'normal') {
                orderamt = res.data.data[0].priceBean.goldPrice
                cashPrice = res.data.data[0].priceBean.price

              } else {
                orderamt = res.data.data[0].priceBean.vipGoldPrice
                cashPrice = res.data.data[0].priceBean.vipPrice
              }

              if (type == 'rent') {
                orderamt = res.data.data[0].priceBean.goldDeposit
                cashPrice = res.data.data[0].priceBean.deposit
              }

              rentPrice = res.data.data[0].rentPrice;

              that.setData({
                item: res.data.data[0],
                info: res.data.ext,
                rentPrice: rentPrice,
                totalAmount: orderamt * num,
                orderamt: orderamt,
                count: num,
                mobilephone: mobilephone,
                shopid: shopid,
                userid: userinfoid,
                cashPrice: cashPrice,
                cashTotal: cashPrice * num
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
      }
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  selectType: function (options) {
    var type = options.currentTarget.id;
    this.load(type);
  },
  load: function (type, ticketid) {
    var that = this;
    var userid = '';
    var shopid = '';
    var ticketid = ticketid;
    var pub_url = getApp().globalData.url;
    var url = pub_url + '/toysburg/ticket/getBuyDetail'
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
          userid: userid,
          shopid: shopid,
          mobilephone: mobilephone
        })
        that.checkVip(userid);
        wx.request({
          url: url,
          method: 'GET',
          data: {
            terminal: 'android',
            shopid: shopid,
            userid: userid,
            ticketid: ticketid
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
              if (vip == 'normal') {
                price = res.data.object.priceBean.goldPrice
                cashPrice = res.data.object.priceBean.price
              } else {
                price = res.data.object.priceBean.vipGoldPrice
                cashPrice = res.data.object.priceBean.vipPrice
              }
              that.setData({
                item: res.data.object,
                totalAmount: price * that.data.count,
                relPrice: price,
                cashTotal: cashPrice * that.data.count,
                cashPrice: cashPrice
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
