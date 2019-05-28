var QRCode = require('../../../../util/qrcode.js');
var qrcode;
Page({
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
      },

      fail({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  name(e){
    var name = e.detail.value;
    var btnClass = 'def-btn';
    if(name != ''){
      btnClass = 'act-btn';
    }
    this.setData({
      name: name,
      btnClass: btnClass
    })
  },
  sub(){
    var birthday = this.data.date;
    var name = this.data.name;
    var sex = this.data.index;
    var imageSrc = this.data.imageSrc;
    var that = this;

    if (name == ''){
      return false;
    }
    if (imageSrc == ''){
      wx.showToast({
        title: '请上传宝宝的照片',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if(sex == 0){
      sex = 'M';
    }else{
      sex = 'F';
    }
    var cardId = this.data.id;
    var isActivation = this.data.isActivation;
    var pub_url = getApp().globalData.url;
    wx.uploadFile({
      url: pub_url + '/toysburg/myWallet/activateTheCard',
      filePath: imageSrc,
      name: 'data',
      formData: {
        cardId: cardId,
        name: name,
        sex: sex,
        birthday: birthday,
        sphoto: imageSrc,
        version: '1.0.0',
        terminal: 'android'
      },
      success(res) {

        wx.showToast({
          title: res.data.rtnMsg,
          icon: 'success',
          duration: 1000
        })
        that.setData({
          isActivation:'Y'
        })
        that.load();
      },
      fail({ errMsg }) {
        console.log('uploadImage fail, errMsg is', errMsg)
      }
    })
  },
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  data:{
    list:'',
    scroll_height:0,
    scroll_width:0,
    isActivation:'',
    isActivationY:'',
    isActivationS:'',
    id:'',
    array: ['男', '女'],
    index:0,
    date: '2000-01-01',
    imageSrc:'',
    name:'',
    btnClass:'def-btn',
    pub_url:'',
    phone:'',
    cardClass:''
  },
  changeCode(){
    this.load();
  },
  load(){
    var that = this;
    var cardId = this.data.id;
    var title = this.data.title;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var pub_url = getApp().globalData.url;
        var json = JSON.parse(res.data)
        console.log(json)
        that.setData({
          pub_url: pub_url,
          phone: json.mobilephone
        })
        wx.request({
          url: pub_url + '/toysburg/myWallet/searchMyCardDes',
          method: 'GET',
          data: {
            terminal: 'android',
            cardId: cardId
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.setData({
                list: res.data.ext.myCard,
                cardClass: res.data.ext.myCard.cardClass
              })
              if(title == 'ok'){
                title = '激活成功'
              }else{
                title = res.data.ext.myCard.cardName
              }
              wx.setNavigationBarTitle({
                title: title
              })
              var width = (that.data.scroll_width) * 0.6;
              var canvas = '';
              if (res.data.ext.myCard.cardClass == 'measured'){
                canvas = 'measured';
              }else{
                canvas = 'canvas';
              }
              qrcode = new QRCode(canvas, {
                text: res.data.ext.qrCode,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
                width: width,
                height: width
              });
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
    this.setData({
      scroll_height: windowHeight,
      scroll_width:windowWidth,
      isActivation:options.isActivation,
      id:options.id,
      title:options.title,
      public:pub_url
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9f9f9',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.load();

  },
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
