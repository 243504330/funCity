Page({
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  back(){
    wx.navigateBack({
      delta: 1
    })
  },
  goXq(){
    var imgs = this.data.list.ticketDes;
    wx.navigateTo({
      url: '../video-xq/video-xq?imgs=' + imgs,
    })
  },
  goYh() {
    if (this.data.userinfoid == '') {
      wx.navigateTo({
        url: '../login/login'
      })
      return false;
    }
    wx.navigateTo({
      url: '../card-yh/card-yh'
    })
  },
  goCardDetail(event) {
    if (this.data.userinfoid == '') {
      wx.navigateTo({
        url: '../login/login'
      })
      return false;
    }
    var id = event.currentTarget.id;
    var isActivation = event.currentTarget.dataset.act;
    wx.navigateTo({
      url: '../card-detai/card-detai?id=' + id + '&isActivation=' + isActivation
    })
  },
  data: {
    list: '',
    like: 'bxin',
    ticketid: '',
    likeNum: '',
    pub_url: '',
    userinfoid:'',
    statusBarHeight:''
  },
  goDetai: function () {
    if (this.data.userinfoid == '') {
      wx.navigateTo({
        url: '../login/login'
      })
      return false;
    }
    var id = this.data.ticketid;
    wx.navigateTo({
      url: '../buy-detai/buy-detai?id=' + id
    })
  },
  isLike: function () {
    var like = this.data.like;
    var id = this.data.ticketid;

    if(this.data.userinfoid == ''){
      wx.navigateTo({
        url: '../login/login'
      })
      return false;
    }

    var wibe = ''
    if (like == 'hxin') {
      like = 'unlikes';
      wibe = 'bxin';
    } else {
      like = 'likes';
      wibe = 'hxin';
    }
    var that = this;
    var userinfoid = '';
    var pub_url = getApp().globalData.url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        wx.request({
          url: pub_url + '/toysburg/ticket/likes',
          method: 'GET',
          data: {
            terminal: 'android',
            userid: userinfoid,
            ticketid: id,
            likes: like
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              that.setData({
                likeNum: res.data.ext.praisenum,
                like: wibe
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
  onShow:function(){
    this.load()
  },
  load:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var ticketid = this.data.ticketid;
    var pub_url = this.data.pub_url;

    wx.getStorage({
      key: 'user_data',
      success(res) {
        console.log(res)
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;
        if (!userinfoid) {
          userinfoid = ''
        }
        that.setData({
          userinfoid: userinfoid
        })
        wx.request({
          url: pub_url + '/toysburg/ticket/get',
          method: 'GET',
          data: {
            terminal: 'android',
            userid: userinfoid,
            ticketid: ticketid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              var like = '';
              if (res.data.object.like == true) {
                like = 'hxin';
              } else {
                like = 'bxin';
              }
              that.setData({
                list: res.data.object,
                like: like,
                ticketid: ticketid,
                likeNum: res.data.object.likeNumStr
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
    var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
    console.log(statusBarHeight)
    var id = options.id;
    var pub_url = getApp().globalData.url;
    this.setData({
      scroll_height: windowHeight,
      pub_url: pub_url,
      ticketid:id,
      statusBarHeight:statusBarHeight
    })

  },
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
