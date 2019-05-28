Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    list:''
  },
  onPullDownRefresh() {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    setTimeout(function () {
      wx.stopPullDownRefresh({
        complete(res) {
          wx.hideToast()
          console.log(res, new Date())
        }
      })
    }, 1000)

  },
  goDetai: function (event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../yue-order-detai/yue-order-detai?id=' + id
    })
  },
  goOrderDetai(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../xf-order-detai/xf-order-detai?id='+id
    })
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.load();
  },
  load:function(){
    var that = this;
    var userid = '';
    var shopid = '';
    var pub_url = getApp().globalData.url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userid = json.id;
        shopid = json.shopid;
        wx.request({
          url: pub_url + '/toysburg/myorder/recharge/getRecharge',
          method: 'GET',
          data: {
            terminal: 'android',
            userid: userid,
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
              console.log(that.data.list)
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
