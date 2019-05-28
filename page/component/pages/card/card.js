Page({
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  goCardDetail(event){
    var id = event.currentTarget.id;
    var isActivation = event.currentTarget.dataset.act;
    if (isActivation == 'Y') {
      wx.navigateTo({
        url: '../card-detai/card-detai?id=' + id + '&isActivation=' + isActivation
      })
    } else {

      var pub_url = getApp().globalData.url;
      var that = this;
      wx.getStorage({
        key: 'user_data',
        success(res) {
          var json = JSON.parse(res.data);
          var userinfoid = json.id;
          var shopid = json.shopid;
          wx.request({
            url: pub_url + '/toysburg/userChildren/selectUserChildren',
            method: 'GET',
            data: {
              terminal: 'ios',
              userId: userinfoid,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res)
              if (res.data.retCode == '000') {
                if (res.data.data == '') {
                  wx.showModal({
                    title: '提示',
                    content: '激活卡需绑定宝宝档案，是否新建宝宝档案？',
                    confirmText: '新建档案',
                    cancelText: '再想想',
                    success(res) {
                      if (res.confirm) {
                        var id = that.data.id;
                        wx.navigateTo({
                          url: '../bb-creat/bb-creat?id=' + id
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                } else {
                  wx.navigateTo({
                          url: '../bb-bind/bb-bind?id=' + id
                        })
                }
              } else {
                
              }
            },
            fail(error) {
              console.log(error)
            }
          })
        }
      })
    }
  },
  data:{
    list:''
  },
  onShow:function(){
    var that = this;
    var userinfoid = '';
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        var pub_url = getApp().globalData.url;
        wx.request({
          url: pub_url + '/toysburg/myWallet/searchAllMyCard',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
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
  },
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
