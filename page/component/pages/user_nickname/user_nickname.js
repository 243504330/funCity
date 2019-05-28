Page({
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  data:{
    photo:'',
    phone:'',
    sex:'',
    nickname:'123',
    imageSrc:'',
    pub_url:'',
    userinfoid:'',
    phone:'',
    btn:'act-btn'
  },
  cha:function(){
    console.log(123)
    this.setData({
      nickname:'',
      btn:'def-btn'
    })
  },
  beChange:function(){
    var pub_url = getApp().globalData.url;
    var userid = this.data.userinfoid;
    var mobilephone = this.data.phone;
    var nickname = this.data.nickname;

    if(nickname.length > 8){
      wx.showToast({
        title: '名字长度不能超过8位',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    wx.request({
      url: pub_url + '/toysburg/user/modifyUserInfo',
      method: 'GET',
      data: {
        terminal: 'android',
        userinfoid: userid,
        mobilephone: mobilephone,
        nickname: nickname,
        act: 'nickname'
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
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
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
  nickname:function(opt){
    console.log(opt)
    var nickname = opt.detail.value;
    this.setData({
      nickname:nickname
    })
    if(this.data.nickname == ''){
      this.setData({
        btn:'def-btn'
      })
    }else{
      this.setData({
        btn: 'act-btn'
      })
    }
  },
  save:function(){
    if(this.data.nickname == ''){
      return false
    }
    this.beChange();
  },
  sexChange:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        console.log(res.tapIndex)
        var sexName = ''
        if(res.tapIndex == 0){
          sexName = 'B'
        }else{
          sexName = 'G'
        }

        that.setData({
          sex: sexName
        })
        that.beChange();
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        that.setData({
          userinfoid:userinfoid,
          phone:json.mobilephone
        })
      }
    })
    this.setData({
      scroll_height: windowHeight,
      nickname: options.nickname,
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
  },
  chooseImage() {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        const imageSrc = res.tempFilePaths[0]
        self.setData({
          imageSrc: imageSrc
        })
        self.sub();
      },
      fail({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  sub:function(){
    var userinfoid = this.data.userinfoid;
    var sex = this.data.sex;
    var imageSrc = this.data.imageSrc;
    var nickname = this.data.nickname;
    var pub_url = getApp().globalData.url;

    wx.uploadFile({
      url: pub_url + '/toysburg/user/modifyUserInfo',
      filePath: imageSrc,
      name: 'data',
      formData: {
        userinfoid: userinfoid,
        sex:sex,
        sphoto: imageSrc,
        nickname:nickname,
        version: '1.0.0',
        terminal: 'android'
      },
      success(res) {
          console.log(res)
      
      },
      fail({ errMsg }) {
        console.log('uploadImage fail, errMsg is', errMsg)
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
