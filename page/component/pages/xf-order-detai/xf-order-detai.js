Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    list:'',
    orderNo:''
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
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
  onLoad: function (options) {
    var that = this;
    var orderid = options.id;

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    var that = this;
    var userid = '';
    var shopid = '';
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url:pub_url
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userid = json.id;
        shopid = json.shopid;
        wx.request({
          url: pub_url + '/toysburg/order/expenditureDetail',
          method: 'GET',
          data: {
            terminal: 'android',
            id: orderid,
            userId: userid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var orderNo = res.data.object.orderNo;
              orderNo = orderNo.slice(orderNo.length - 3);
              that.setData({
               list:res.data,
               orderNo:orderNo
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
  load:function(){

  }
})
