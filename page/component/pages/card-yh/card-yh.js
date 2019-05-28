Page({
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  goYhBuy(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../yh-buy-detai/yh-buy-detai?id=' + id
    })
  },
  goCardDetail(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../card-buy-detai/card-buy-detai?id=' + id
    })
  },
  data:{
    list:'',
    pub_url:'',
    cardType:'block'
  },
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var type = options.type;
    if(type == 'cardType'){
      var cardType = 'none';
      this.setData({
        cardType:cardType
      })
      wx.setNavigationBarTitle({
        title: '超值购卡'
      })
    }
    this.setData({
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
    var that = this;
    var userinfoid = '';
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url:pub_url
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        var shopid = json.shopid;
        wx.request({
          url: pub_url + '/toysburg/ticket/getTicketPackage',
          method: 'GET',
          data: {
            terminal: 'android',
            shopid: shopid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          complete(res){
            wx.hideLoading()
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              that.setData({
                list:res.data
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
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
