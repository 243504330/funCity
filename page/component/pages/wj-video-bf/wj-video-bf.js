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
  goXq:function(){
    var imgs = this.data.list.toyDes;
    wx.navigateTo({
      url: '../video-xq/video-xq?imgs=' + imgs,
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
    dBox:'none',
    dMenu:'block',
    res:'',
    shopid:'',
    id:'',
    ggList:'',
    allList:'',
    ggClass:'',
    num:1,
    type:'',
    userid:'',
    pub_url:'',
    toyid:'',
    statusBarHeight:''
  },
  sub:function(){
    var shopid = this.data.shopid;
    var id = this.data.ggList.id;
    var userid = this.data.userid
    var type = this.data.type
    var that = this
    var num = this.data.num
    var pub_url = getApp().globalData.url;
    wx.request({
      url: pub_url + '/toysburg/sharingToys/toysDetermineOrder',
      method: 'GET',
      data: {
        terminal: 'android',
        type: type,
        shopId: shopid,
        userId:userid,
        id: id,
        quantity:num
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.retCode == '000') {
          that.setData({
            dBox: 'none',
            dMenu: 'block',
          })
          wx.navigateTo({
            url: '../wj-buy-detai/wj-buy-detai?id=' + id + '&type=' + type + '&quantity=' + num
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
  jian:function(){
    var num = this.data.num - 1;
    if(num <= 0){
      num = 1;
    }
    this.setData({
      num:num
    })
  },
  jia:function(){
    var num = this.data.num + 1;
    this.setData({
      num:num
    })
  },
  xuanGG:function(event){
    console.log(this.data.allList)
    var ggClass = event.currentTarget.id
    console.log(ggClass)
    var allList = this.data.allList

    for(var i = 0; i < allList.length; i++){
      if (ggClass == allList[i].toySpec){
        this.setData({
          ggList:allList[i]
        })
      }
    }

    this.setData({
      ggClass:ggClass
    })
  },
  goDetai:function(){
    var id = this.data.ticketid;
    wx.navigateTo({
      url: '../buy-detai/buy-detai?id='+id
    })
  },
  close:function(){
    this.setData({
      dBox:'none',
      dMenu:'block'
    })
  },
  buyAndZu:function(event){
    if (this.data.userid == '') {
      wx.navigateTo({
        url: '../login/login'
      })
      return false;
    }
    var shopid = this.data.shopid;
    var id = this.data.id;
    var type = event.currentTarget.id;
    var pub_url = getApp().globalData.url;
    var that = this
    console.log(type)
    this.setData({
      type:type
    })
    wx.request({
      url: pub_url + '/toysburg/sharingToys/toysSpec',
      method: 'GET',
      data: {
        terminal: 'android',
        type: type,
        shopId: shopid,
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.retCode == '000') {
          var count = res.data.data;

          if(count.length > 1){
            var ggList = count[0]
            console.log(ggList)
            that.setData({
              dBox: 'block',
              dMenu:'none',
              ggList: ggList,
              ggClass:ggList.toySpec,
              allList:count
            })
          }else{
            var type = that.data.type;
            var id = count[0].id;
            wx.navigateTo({
              url: '../wj-buy-detai/wj-buy-detai?id=' + id + '&type=' + type + '&quantity=1'
            })
          }
          
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
  isLike:function(){
    var like = this.data.like;
    if(this.data.userid == ''){
      wx.navigateTo({
        url: '../login/login'
      })
      return false;
    }
    var id = this.data.id;
    var pub_url = getApp().globalData.url;
    var wibe = ''
    if(like == 'hxin'){
      like = 'unlikes';
      wibe = 'bxin';
    }else{
      like = 'likes';
      wibe = 'hxin';
    }
    console.log(like)
    var that = this;
    var userinfoid = '';
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        wx.request({
          url: pub_url + '/toysburg/sharingToys/likeToys',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            id: id,
            likes:like,
            version:'1.0.0'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.setData({
                likeNum:res.data.object.likeNumStr,
                like: wibe,
                res:res,
                userid: userinfoid
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
    var id = this.data.toyid;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;
        if(!userinfoid){
          userinfoid = ''
        }
        that.setData({
          userid: userinfoid,
          shopid: shopid
        })
        wx.request({
          url: pub_url + '/toysburg/sharingToys/toysDetails',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            shopId: shopid,
            id: id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              var like = '';
              if (res.data.ext.like == true) {
                like = 'hxin';
              } else {
                like = 'bxin';
              }
              that.setData({
                list: res.data.object,
                like: like,
                id: id,
                likeNum: res.data.object.likeNumStr,
                shopid: shopid
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
    var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
    var id = options.id;
    this.setData({
      scroll_height: windowHeight,
      pub_url:pub_url,
      toyid:id,
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
  },
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
