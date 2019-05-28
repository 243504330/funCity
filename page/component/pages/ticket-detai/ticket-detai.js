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
      name:options.name,
      dueDate:options.dueDate,
      ticketId:options.ticketId
    })
    qrcode = new QRCode('canvas', {
      text: options.ticketId,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

  },
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
