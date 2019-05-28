Page({
  launchAppError(e) {
    console.log(e.detail.errMsg)
    var msg = e.detail.errMsg;
    if (msg == 'invalid scene') {
      wx.showModal({
        title: '',
        content: '下载APP立即体验！',
        showCancel: false,
        success(res) {

        }
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '梦幻城堡',
      path: "page/component/index",
    }
  },
  goCz() {
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
  data:{
    scroll_width:'',
    scroll_height:'',
    list: ''
  },
  onLoad: function (options) {
    var that = this;
    var type = options.id;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    var that = this
    this.setData({
      scroll_height: windowHeight,
      scroll_width: windowWidth,
      pub_url: pub_url
    })
  },
  onShow:function(){
    var that = this;
    var pub_url = this.data.pub_url;
    wx.request({
      url: pub_url + '/toysburg/JunkToys/queryJunkToys',
      method: 'GET',
      data: {
        terminal: 'android',
        userId: '',
        toyClassId: '',
        pageSize: 4,
        pageCurrent: 0

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {

          var list = res.data.data;

          for (var i = 0; i < list.length; i++) {
            var path = list[i].imgPath;
            path = path.split(',');
            list[i].imgPath = path[0];
          }

          that.setData({
            list: res.data.data
          })
        } else {

        }
      },
      fail(error) {
        console.log(error)
      }
    })

  }
})
