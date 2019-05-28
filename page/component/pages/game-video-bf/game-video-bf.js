Page({
  goUser() {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
  goXq() {
    var imgs = this.data.list.gameDes;
    wx.navigateTo({
      url: '../video-xq/video-xq?imgs=' + imgs,
    })
  },
  goGame(){
    if (this.data.userinfoid == '') {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }
    wx.navigateTo({
      url: '../game-coin-buy/game-coin-buy'
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
    like:'bxin',
    ticketid:'',
    likeNum:'',
    pub_url:'',
    userinfoid:'',
    statusBarHeight:''
  },
  goDetai:function(){
    var id = this.data.ticketid;
    wx.navigateTo({
      url: '../buy-detai/buy-detai?id='+id
    })
  },
  isLike:function(){
    var like = this.data.like;
    if (this.data.userinfoid == ''){
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }
    var id = this.data.ticketid;
    var pub_url = getApp().globalData.url;
    var wibe = ''
    if(like == 'hxin'){
      like = 'unlikes';
      wibe = 'bxin';
    }else{
      like = 'likes';
      wibe = 'hxin';
    }
    var that = this;
    var userinfoid = '';
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        wx.request({
          url: pub_url + '/toysburg/game/likes',
          method: 'GET',
          data: {
            terminal: 'android',
            userid: userinfoid,
            gameid: id,
            likes:like
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              that.setData({
                likeNum:res.data.ext.praisenum,
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
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    var ticketid = this.data.ticketid;
    console.log(pub_url)
    wx.getStorage({
      key: 'user_data',
      success(res) {
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
          url: pub_url + '/toysburg/game/get',
          method: 'GET',
          data: {
            terminal: 'android',
            userid: userinfoid,
            gameid: ticketid
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
    var id = options.id;
    var pub_url = getApp().globalData.url;
    this.setData({
      scroll_height: windowHeight,
      pub_url:pub_url,
      ticketid:id,
      statusBarHeight:statusBarHeight
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })


  }
})
