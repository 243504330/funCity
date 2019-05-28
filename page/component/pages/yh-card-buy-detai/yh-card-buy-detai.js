Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
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
    relPrice:0
  },
  jia:function(){
    var count = this.data.count + 1;
    var price = this.data.relPrice;
    this.setData({
      count:count,
      totalAmount: parseInt((count * price)*10)/10
    })
  },
  jian:function(){
    var count = this.data.count - 1;
    var price = this.data.relPrice;
    if(count <= 0){
      count = 1
    }
    this.setData({
      count:count,
      totalAmount: parseInt((count * price) * 10) / 10
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
    this.setData({
      isShow:'show'
    });
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

    wx.request({
      url: 'http://toys.dev108.com/toysburg/buyZone/buyCard',
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
          wx.redirectTo({
            url: '../buy-success/buy-success?type=card'
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.rtnMsg,
            confirmText:'忘记密码',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
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
    wx.request({
      url: 'http://toys.dev108.com/toysburg/user/getVip',
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
    var url = 'http://toys.dev108.com/toysburg/buyZone/checkBuyCard'
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
          mobilephone: mobilephone
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
              if(vip == 'normal'){
                price = res.data.ext.card.priceBean.goldPrice
              }else{
                price = res.data.ext.card.priceBean.vipGoldPrice
              }
              that.setData({
                item: res.data.ext,
                totalAmount:price * that.data.count,
                relPrice:price
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
