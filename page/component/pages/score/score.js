Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  back:function(){
    wx.navigateBack()
  },
  goApp:function(){
    wx.showModal({
      title:'温馨提示',
      content: '下载APP立即体验！',
      showCancel:false,
      success(res) {

      }
    })
  },
  data:{
    list:'',
    pub_url:'',
    score:0,
    statusBarHeight:'',
    sumscore:0
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onShow:function(){
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        wx.request({
          url: pub_url + '/toysburg/pointsExchange/pointsExchangePage',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            shopId: shopid,
            pageCurrent:0,
            pageSize:100
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.setData({
                list:res.data.data,
                sumscore: res.data.object.sumscore
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
              title: '请求超时',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail(err) {

      }
    })
  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var pub_url = getApp().globalData.url;
    var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
    this.setData({
      score: options.score,
      pub_url:pub_url,
      statusBarHeight: statusBarHeight
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#333333',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  }
})
