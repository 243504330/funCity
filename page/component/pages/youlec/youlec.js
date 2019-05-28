Page({
  goAllBuys() {
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;

        if (!userinfoid) {
          wx.navigateTo({
            url: '../login/login'
          })
        } else {
          wx.navigateTo({
            url: '../all-buys/all-buys',
          })
        }
      },
      fail(err) {

      }
    })
  },
  book:function(){
    wx.navigateTo({
      url: '../book/book'
    })
  },
  chongzhi(){
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;

        if (!userinfoid) {
          wx.navigateTo({
            url: '../login/login'
          })
        } else {
          wx.navigateTo({
            url: '../gold-cz/gold-cz',
          })
        }

      },
      fail(err) {

      }
    })
  },
  goWallet() {
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;

        if (!userinfoid) {
          wx.navigateTo({
            url: '../login/login'
          })
        } else {
          wx.navigateTo({
            url: '../my_wallet/my_wallet',
          })
        }

      },
      fail(err) {

      }
    })

  },
  goUser() {
    var isLogin = this.data.isLogin;
    if(isLogin == 'no'){
      wx.navigateTo({
        url: '../login/login'
      })
    }else{
      wx.navigateTo({
        url: '../user/user'
      })
    }
  },
  data:{
    data:'',
    pub_url:'',
    shopName:'',
    isLogin:'no'
  },
  goGame:function(){
    wx.navigateTo({
      url: '../group-game/group-game'
    })
  },
  goWj: function () {
    wx.navigateTo({
      url: '../group-wj/group-wj'
    })
  },
  goCy: function () {
    wx.navigateTo({
      url: '../group-cy/group-cy'
    })
  },
  goMp:function(){
    wx.navigateTo({
      url: '../group-mp/group-mp'
    })
  },
  onShow:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        userinfoid = json.id;
        shopid = json.shopid;
        var shopName = json.shopname

        that.setData({
          shopName: shopName
        })

        if (!userinfoid) {
          that.setData({
            isLogin: 'no'
          })
          return false;
        }else{
          that.setData({
            isLogin: 'yes'
          })
        }

        wx.request({
          url: pub_url + '/toysburg/myWallet/findMyWallet',
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
                data: res.data.object
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
      pub_url: pub_url,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#C7E394',
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
