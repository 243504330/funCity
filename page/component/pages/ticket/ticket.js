var QRCode = require('../../../../util/qrcode.js');
var qrcode;
Page({
  goTicketDetail(event){
    console.log(event)
    var ticketId = event.currentTarget.id;
    var name = event.currentTarget.dataset.name;
    var duedate = event.currentTarget.dataset.duedate;
    var width = (this.data.scroll_width) * 0.6;
    var as = event.currentTarget.dataset.notavailable;

    if (as == 'false'){
      wx.showToast({
        title: '此票暂不可用',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    this.setData({
      state:'block',
      scroll:false,
      name:name,
      duedate: duedate
    })
    qrcode = new QRCode('canvas', {
      text: ticketId,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
      width: width,
      height: width
    });
  },
  close:function(){
    this.setData({
      state:'none',
      scroll:true
    })
  },
  data:{
    list:'',
    hasTicket:'none',
    hasList:'none',
    pub_url:'',
    scroll_width:'',
    scroll_height:'',
    state:'none',
    name:'',
    duedate:'',
    gqList:'',
    showGq:false,
    scroll:true
  },
  makeCode:function(){

  },
  onLoad: function (options) {
    var that = this;
    let windowWidth = wx.getSystemInfoSync().windowWidth
    let windowHeight = wx.getSystemInfoSync().windowHeight
    
    this.setData({
      scroll_width: windowWidth,
      scroll_height: windowHeight
    })
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
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        that.setData({
          pub_url:pub_url
        })
        wx.request({
          url: pub_url + '/toysburg/myWallet/findAllMyTicket',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            shopId: shopid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var list = res.data.ext.usableTickList;
              var gqList = res.data.ext.unavailableTickList;

              if (gqList == undefined || gqList == ''){

              }else{
                that.setData({
                  showGq: true
                })
              }
              
              if (list == undefined){
                that.setData({
                  hasTicket: 'block',
                  hasList:'none'
                })
              }else{
                console.log(123)
                that.setData({
                  list: list,
                  gqList: gqList,
                  hasTicket:'none',
                  hasList:'block'
                })
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
            console.log(error)
          }
        })
      },
      fail(err) {

      }
    })
  }
})
