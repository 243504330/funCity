Page({
  goTicketDetail(event){

  },
  data:{
    list:''
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '积分明细',
      success: function (res) {
        // success
      }
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
        wx.request({
          url: pub_url + '/toysburg/myWallet/getScoreRecord',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
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
                list:res.data.data
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
  }
})
