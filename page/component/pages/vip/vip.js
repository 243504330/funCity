Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  back:function(){
    wx.navigateBack()
  },
  getCoin:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;

    wx.getStorage({
      key: 'user_data',
      complete() {
      },
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;

        console.log(userinfoid)

        wx.request({
          url: pub_url + '/toysburg/zoneManage/vipBoon',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              wx.showToast({
                title: '领取成功',
                icon: 'none',
                duration: 2000
              })
              that.onShow();
            } else {

            }
          },
          fail(error) {

          }
        })
      },
      fail(err) {

      }
    })
  },
  data:{
    list:'',
    pub_url:'',
    score:0
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onShow:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;

    wx.getStorage({
      key: 'user_data',
      complete() {
        wx.hideLoading()
      },
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;

        wx.request({
          url: pub_url + '/toysburg/user/searchMyInfo',
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
            if (res.data.retCode == '000') {
              that.setData({
                list:res.data.ext.myWalletBean.appUserInfo
              })
              console.log(that.data.data)
            } else {

            }
          },
          fail(error) {

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
    this.setData({
      score: options.score,
      pub_url:pub_url
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
