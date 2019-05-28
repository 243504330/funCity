var fun_aes = require('../../../../util/aes.js');
var utilMd5 = require('../../../../util/md5.js');
Page({
  goTicketDetail(event){

  },
  data:{
    list:'',
    hasTicket:'none',
    hasList:'none',
    pub_url:'',
    userpwd:'',
    focus: true,
    userid:'',
    phone:'',
    first:'block',
    confirm:'none',
    firstPwd:'',
    oldpwd:true,
    pwdleng:0,
    modal_flag: 'none'
  },
  back:function(){
    wx.showModal({
      title: '提示',
      content: '是否放弃设置交易密码？',
      success(res) {
        if (res.confirm) {
          wx.navigateBack()
        } else if (res.cancel) {
      
        }
      }
    })
  },
  out:function(){
    wx.clearStorage();
    wx.navigateBack({
      delta: 3
    })
  },
  subPwd:function(){
    this.setData({
      focus:true
    })
  },
  pwdset:function(){

    var that = this;
    var userid = this.data.userid;
    var mobilephone = this.data.phone;
    // userpwd = utilMd5.hexMD5(userpwd); 
    var vip = this.data.vip;
    var pwd = this.data.userpwd;
    var json = {
      "tradePWD": pwd,
    }

    var data = JSON.stringify(json);
    var key_str = mobilephone + userid.substring(4, 9);

    var key = fun_aes.CryptoJS.enc.Latin1.parse(key_str);

    var iv = fun_aes.CryptoJS.enc.Latin1.parse('40ccdc3b24cc11e7');
    var encrypted = fun_aes.CryptoJS.AES.encrypt(data, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    encrypted = '' + encrypted;

    var pub_url = getApp().globalData.url;
    wx.request({
      url: pub_url + '/toysburg/user/setUserTradePWD',
      method: 'GET',
      data: {
        terminal: 'android',
        userinfoid: userid,
        mobilephone: mobilephone,
        data: encrypted
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            modal_flag:'block'
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)
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
  pwdCheck:function(){
    var that = this;
    var userid = this.data.userid;
    var mobilephone = this.data.phone;
    // userpwd = utilMd5.hexMD5(userpwd); 
    var vip = this.data.vip;
    var pwd = this.data.userpwd;
    var json = {
      "tradePWD": pwd,
    }

    var data = JSON.stringify(json);
    var key_str = mobilephone + userid.substring(4, 9);

    var key = fun_aes.CryptoJS.enc.Latin1.parse(key_str);

    var iv = fun_aes.CryptoJS.enc.Latin1.parse('40ccdc3b24cc11e7');
    var encrypted = fun_aes.CryptoJS.AES.encrypt(data, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    encrypted = '' + encrypted;

    var pub_url = getApp().globalData.url;
    wx.request({
      url: pub_url + '/toysburg/user/verifyPwd',
      method: 'GET',
      data: {
        terminal: 'android',
        userinfoid: userid,
        mobilephone: mobilephone,
        data: encrypted
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
            that.setData({
              oldpwd:false,
              userpwd: '',
              pwdleng: 0
            })
        } else {
          wx.showToast({
            title: res.data.rtnMsg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            userpwd: '',
            pwdleng: 0
          })
        }
      },
      fail(error) {
        console.log(error)
      }
    })
  },
  userpwd:function(event){
    var userpwd = event.detail.value;
    this.setData({
      pwdleng: userpwd.length,
      userpwd: userpwd
    })
    if (userpwd.length == 6) {

      if (this.data.firstPwd != '') {
        
        if (this.data.firstPwd == userpwd){
          this.pwdset();
          return false
        }else{
          wx.showToast({
            title: '两次密码不一致,请重新输入',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            first: 'block',
            confirm: 'none',
            firstPwd: '',
            userpwd: '',
            pwdleng: 0
          })
          return false
        }
      }
      this.setData({
        first:'none',
        confirm:'block',
        firstPwd:userpwd,
        userpwd:'',
        pwdleng:0
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        that.setData({
          userid:json.id,
          phone:json.mobilephone
        })
      }
    })
  }
})
