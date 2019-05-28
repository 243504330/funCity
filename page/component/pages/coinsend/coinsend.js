var QRCode = require('../../../../util/qrcode.js');
var qrcode;
Page({
  chooseImage() {

  },
  name(e){

  },
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  data:{
    list:'',
    name:'',
    dueDate:'',
    ticketId:''
  },
  changeCode:function(){
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        wx.request({
          url: pub_url + '/toysburg/myWallet/extractGameCurrency',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              qrcode = new QRCode('canvas', {
                text: res.data.object,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#C7E394',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      scroll_height: windowHeight,
    })
    this.changeCode();

  },
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
