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
    isFot:false,
    time:60,
    codeMs:'忘记交易密码？',
    mdPhone:'',
    codeShow:true,
    modal_flag:'none'
  },
  back:function(){
    wx.showModal({
      title: '提示',
      content: '是否放弃修改交易密码？',
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
  resetPwd:function(){
    var url = getApp().globalData.url;
    var phone = this.data.phone;
    var pwd = this.data.userpwd;
    var that = this;
    wx.request({
      url: url + '/toysburg/user/resetTradePWD',
      method: 'GET',
      data: {
        recNum: phone,
        code: pwd,
        terminal: 'ios'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          wx.showToast({
            title: res.data.rtnMsg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            oldpwd: false,
            isFot:false,
            userpwd: '',
            pwdleng: 0,
            codeShow:false
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
        wx.showToast({
          title: '网络异常，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  fotPwd:function(){
    if (this.data.time != 60) {
      return false;
    }
    // if (this.data.phone == '') {
    //   wx.showToast({
    //     title: '请输入正确的手机号码',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    var fun_aes = require('../../../../util/aes.js');
    var that = this;

    var setinter = setInterval(function () {
      var time = that.data.time;
      var codeMs = '';
      var codeSty = '';
      if (time == 1 || time < 1) {
        clearInterval(setinter);
        time = 60;
        codeMs = '忘记交易密码？';
        codeSty = 'def-code';
      } else {
        time = time - 1;
        codeMs = time + 's重新发送';
        codeSty = 'act-code';
      }
      that.setData({
        time: time,
        codeMs: codeMs
      })
    }, 1000)

    var data = this.data.phone;
    var key = fun_aes.CryptoJS.enc.Latin1.parse('a1ba000c29c04oid');
    var iv = fun_aes.CryptoJS.enc.Latin1.parse('40ccdc3b24cc11e7');
    var encrypted = fun_aes.CryptoJS.AES.encrypt(data, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    encrypted = '' + encrypted;
    var url = getApp().globalData.url;
    wx.request({
      url: url + '/toysburg/user/getFirstMobileLoginCheckCode',
      method: 'GET',
      data: {
        data: encrypted,
        version: 'ios',
        terminal: 'ios',
        type:2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.retCode == '000') {
          wx.showToast({
            title: res.data.rtnMsg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            isFot:true
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
        wx.showToast({
          title: '网络异常，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
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

      if(this.data.isFot == true){
        this.resetPwd();
        return false;
      }

      if(this.data.oldpwd == true){
        this.pwdCheck();
        return false;
      }

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
    console.log(options)
    var state = options.state;
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
        var mdPhone = json.mobilephone;
        mdPhone = mdPhone.substring(0,3) + 'xxxx' + mdPhone.substring(7,11);

        that.setData({
          userid:json.id,
          phone:json.mobilephone,
          mdPhone: mdPhone
        })


        if (state == 'set') {
          that.fotPwd();
        }
      }
    })
  }
})
