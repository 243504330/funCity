const openIdUrl = require('./config').openIdUrl

App({
  onLaunch(opts) {
    console.log('App Launch', opts)
  },
  onShow(opts) {
    var rect = wx.getMenuButtonBoundingClientRect();
    console.log(rect)
    this.globalData.rectHeight = rect.height;
    this.globalData.rectTop = rect.top;
  },
  onHide() {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    openid: null,
    session_key:null,
    unionid:null,
    rectHeight:0,
    rectTop:0,
    url:'https://toys.mediahx.com'
    // url:'http://toys.dev108.com'
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code
            },
            success(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  }
})
