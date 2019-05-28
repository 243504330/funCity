Page({
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  goCardDetail(event){
    
    var id = event.currentTarget.id;
    var isActivation = event.currentTarget.dataset.act;
    wx.navigateTo({
      url: '../card-detai/card-detai?id=' + id + '&isActivation=' + isActivation
    })
  },
  data:{
    list:'',
    wjid:'',
    userinfoid:'',
    price:''
  },
  goVideo:function(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../wj-video-bf/wj-video-bf?id='+id
    })
  },
  goWjBuy:function(){
    if (this.data.userinfoid == '') {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }
    var id = this.data.wjid;
    wx.navigateTo({
      url: '../buy-detai/buy-detai?id=' + id
    })
  },
  onShow:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid
        if (!userinfoid) {
          userinfoid = ''
        }
        that.setData({
          userinfoid: userinfoid
        })
        wx.request({
          url: pub_url + '/toysburg/sharingToys/toysTicket',
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userId: userinfoid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.setData({
                wjid: res.data.data[0].ticketId,
                price:res.data.data[0].price
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
        wx.request({
          url: pub_url + '/toysburg/sharingToys/sharingToysPage',
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userId: userinfoid

          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {

              that.setData({
                list: res.data.data
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
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    this.setData({
      scroll_height: windowHeight,
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

  },
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
