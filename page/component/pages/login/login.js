Page({
  loginPub:function(){
    var share = this.data.share;
    wx.redirectTo({
      url: '../login-pub/login-pub?share=' + share
    })
  },
  getPhoneNumber(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok'){
      var url = getApp().globalData.url;
      var that = this;
      var sessionKey = getApp().globalData.session_key;
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv
      console.log(iv)
      wx.showLoading();
      wx.request({
        url: url + '/toysburg/user/minProgramDecrypt',
        method: 'GET',
        data: {
          terminal: 'ios',
          sessionKey: sessionKey,
          encryptedData: encryptedData,
          iv:iv
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          if (res.data.retCode == '000') {
            var obj = JSON.parse(res.data.object);
            that.setData({
              recNum: obj.phoneNumber
            })
            that.zLogin();
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
    }else {
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 2000
      })
    }
  },
  zLogin:function(){
      var url = getApp().globalData.url;
      var recNum = this.data.recNum;
      var unionid = this.data.unionid;
      var screen_name = this.data.screen_name;
      var gender = this.data.gender;
      var iconurl = this.data.iconurl;
      var that = this;

      wx.request({
        url: url + '/toysburg/user/noCodeLogin',
        method: 'GET',
        data: {
          terminal: 'ios',
          recNum: recNum,
          unionid: unionid,
          screen_name: screen_name,
          gender: gender,
          iconurl: iconurl
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          if (res.data.retCode == '000') {
            var user_data = JSON.stringify(res.data.object);
            wx.setStorage({
              key: 'user_data',
              data: user_data
            })
            wx.showToast({
              title: res.data.rtnMsg,
              icon: 'none',
              duration: 1000
            })
            console.log(that.data.share)
            if(that.data.share == 'share'){
              setTimeout(function () {
                wx.switchTab({
                  url: '../my_wallet/my_wallet',
                })
              }, 1000)
            } else if (res.data.object.isfirstlogin != 'N') {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../bb-creat/bb-creat',
                })
              }, 1000)
            } else{
              setTimeout(function () {
                wx.navigateBack({ changed: true });
              }, 1000)
            }
            
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
  bindGetUserInfo(e){
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      var res = e.detail;
      var gender = res.userInfo.gender;
      if (gender == 1) {
        var sex = 'B'
      } else {
        var sex = 'G'
      }
      wx.showToast({
        title: '授权成功',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function(){
        that.setData({
          type: 'phone',
          phoneLogin: false,
          screen_name: res.userInfo.nickName,
          gender: sex,
          iconurl: res.userInfo.avatarUrl
        })
      },500)
    }else{
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 2000
      })
    }
  },
  data: {
    btn: 'def-btn',
    code:'',
    phone:'',
    codeMs:'获取验证码',
    time:60,
    codeSty:'def-code',
    type:'',
    session_key:'',
    unionid:'',
    recNum:'',
    phoneLogin:true,
    share:''
  },
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  phone:function(e){
    var phone = e.detail.value;
    this.setData({
      phone:phone
    });
    var phone_d = this.data.phone;
    var code_d = this.data.code;
    var btn = ''
    if(this.data.phone != '' && this.data.code != '' ){
      btn = 'act-btn';
    }else{
      btn = 'def-btn';
    }
    this.setData({
      btn:btn
    })
  },
  code: function (e) {
    var code = e.detail.value;
    this.setData({
      code: code
    });
    var phone_d = this.data.phone;
    var code_d = this.data.code;
    var btn = ''
    if (this.data.phone != '' && this.data.code != '') {
      btn = 'act-btn';
    } else {
      btn = 'def-btn';
    }
    this.setData({
      btn: btn
    })
  },
  getCode(){
    if (this.data.time != 60) {
      return false;
    }
    if(this.data.phone == ''){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var fun_aes = require('../../../../util/aes.js');
    var that = this;

    var setinter = setInterval(function(){
      var time = that.data.time;
      var codeMs = '';
      var codeSty = '';
      if(time == 1 || time < 1){
        clearInterval(setinter);
        time = 60;
        codeMs = '获取验证码';
        codeSty = 'def-code';
      }else{
        time = time - 1;
        codeMs = time + 's重新发送';
        codeSty = 'act-code';
      }
      that.setData({
        time: time,
        codeMs: codeMs,
        codeSty: codeSty
      })
    },1000)

    var data = this.data.phone;
    console.log(data)
    var key = fun_aes.CryptoJS.enc.Latin1.parse('a1ba000c29c04oid');
    var iv  = fun_aes.CryptoJS.enc.Latin1.parse('40ccdc3b24cc11e7');
    var encrypted = fun_aes.CryptoJS.AES.encrypt(data, key, { iv: iv, mode: fun_aes.CryptoJS.mode.CBC, padding: fun_aes.CryptoJS.pad.Pkcs7 });
    encrypted = '' + encrypted;
    var url = getApp().globalData.url;
    wx.request({
      url: url + '/toysburg/user/getFirstMobileLoginCheckCode',
      method:'GET',
      data: {
        data: encrypted,
        version:'ios',
        terminal:'ios'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data.retCode == '000'){
          wx.showToast({
            title: res.data.rtnMsg,
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: res.data.rtnMsg,
            icon: 'none',
            duration: 2000
          })
        }
        
      },
      fail(error){
        wx.showToast({
          title:'网络异常，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })

    return false;

    wx.request({
      url: 'http://toys.dev108.com:7994/toysburg/user/toysPictureCode',
      method:'GET',
      data: {
        recNum:'18476698507',
        terminal:'android'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        
        var key = fun_aes.CryptoJS.enc.Latin1.parse('a1ba000c29c04507');
        var iv = fun_aes.CryptoJS.enc.Latin1.parse('40ccdc3b24cc11e7');


        var enc = res.data;
        var decrypted = fun_aes.CryptoJS.AES.decrypt(enc, key, { iv: iv, padding: fun_aes.CryptoJS.pad.Pkcs7 });
        console.log(decrypted)
        console.log(decrypted.toString(fun_aes.CryptoJS.enc.Utf8));

      },
      error(error){
        console.log(error)
      }
    })
  },
  login(){
    var recNum = this.data.phone;
    var code = this.data.code;

 

    if(recNum == '' || code == ''){
      return false;
    }

    var url = getApp().globalData.url;

    wx.request({
      url: url + '/toysburg/user/getLoginCode',
      method: 'GET',
      data: {
        recNum: recNum,
        terminal: 'android',
        version:'1.0.0',
        code:code,
        imei:'toysburg '
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.retCode == '000') {
          var user_data = JSON.stringify(res.data.object);
          wx.setStorage({
            key: 'user_data',
            data: user_data
          })
          wx.showToast({
            title: res.data.rtnMsg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack({ changed: true });
          },2000)
          
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
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var session_key = getApp().globalData.session_key;
    var unionid = getApp().globalData.unionid;

    var share = options.type;

    this.setData({
      scroll_height: windowHeight,
      session_key: session_key,
      unionid: unionid,
      share: share
    })
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res)
              var gender = res.userInfo.gender;
              if (gender == 1) {
                var sex = 'B'
              }else{
                var sex = 'G'
              }
              that.setData({
                type: 'phone',
                screen_name: res.userInfo.nickName,
                gender: sex,
                iconurl: res.userInfo.avatarUrl
              })
            }
          })
        }else{
          that.setData({
            type: 'wx',
          })
        }
      },
      fail(err){
        console.log(err)
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
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
