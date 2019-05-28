Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    list:'',
    pub_url:'',
    orderType:'',
    typeName:''
  },
  copy: function (event) {
    var data = event.currentTarget.id;
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  goTicket:function(){
    var url = ''
    var orderType = this.data.orderType;
    if (orderType == 'card') {
      url = '../card/card'
    }
    if (orderType == 'ticket') {
      url = '../ticket/ticket'
    }
    if (orderType == 'game') {
      url = '../gamecoin/gamecoin'
    }
    wx.navigateTo({
      url: url
    })
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onLoad: function (options) {
    var that = this;
    var orderid = options.id;
    var pub_url = getApp().globalData.url;

    this.setData({
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
    wx.request({
      url: pub_url + '/toysburg/myorder/recharge/getDetailRecharge',
      method: 'GET',
      data: {
        terminal: 'android',
        orderid: orderid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
          that.setData({
            list:res.data.data[0]
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
  load:function(){

  }
})
