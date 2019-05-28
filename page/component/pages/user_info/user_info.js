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
    nickname:'',
    imageSrc:'',
    pub_url:'',
    userinfoid:''
  },
  beChange:function(){
    var pub_url = getApp().globalData.url;
    var userid = this.data.userinfoid;
    var mobilephone = this.data.phone;
    var sex = this.data.sex;
    console.log(sex)
    wx.request({
      url: pub_url + '/toysburg/user/modifyUserInfo',
      method: 'GET',
      data: {
        terminal: 'android',
        userinfoid: userid,
        mobilephone: mobilephone,
        sex: sex,
        act: 'sex'
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
  changeNickname:function(){
    var nickname = this.data.nickname
    wx.navigateTo({
      url: '../user_nickname/user_nickname?nickname='+nickname
    })
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
  onShow:function(options){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;
        that.setData({
          userinfoid: userinfoid
        })
        wx.request({
          url: pub_url + '/toysburg/myWallet/findMyWallet',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            shopId: shopid,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            var json = res.data.object.appUserInfo;
            if (res.data.retCode == '000') {
              that.setData({
                photo: json.photo,
                phone: json.mobilephone,
                sex: json.sex,
                nickname: json.nickname,
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
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    console.log(options);
    this.setData({
      scroll_height: windowHeight,
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
      sizeType: ['original','compressed'],
      sourceType: ['camera','album'],
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
    var imageSrc = this.data.imageSrc;
    var pub_url = getApp().globalData.url;
    console.log(this.data.imageSrc)
    wx.showLoading({
      title: '头像修改中···',
    })
    wx.uploadFile({
      url: pub_url + '/toysburg/user/modifyUserInfo',
      filePath: imageSrc,
      name: 'data',
      formData: {
        userinfoid: userinfoid,
        photo: imageSrc,
        terminal: 'android',
        act:'photo'
      },
      success(res) {
        console.log(res)
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        })

      },
      fail({ errMsg }) {
        console.log('uploadImage fail, errMsg is', errMsg)
        wx.showToast({
          title: '修改失败，请稍后再试',
          icon: 'none',
          duration: 2000
        })
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
