Page({
  launchAppError(e) {
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
  goOther:function(event){
    var userinfoid = this.data.userinfoid;
    var path = event.currentTarget.id;
    var url = '';
    if (userinfoid) {
      url = '../' + path + '/' + path
    } else {
      url = '../login/login'
    }
    wx.navigateTo({
      url: url
    })
  },
  scoreClick:function(){
    var userinfoid = this.data.userinfoid;
    var url = '';
    if (userinfoid) {
      url = '../score/score'
    } else {
      url = '../login/login'
    }
    wx.navigateTo({
      url: url
    })
  },
  vipClick:function(){
    var userinfoid = this.data.userinfoid;
    var url = '';
    if (userinfoid) {
      url = '../vip/vip'
    } else {
      url = '../login/login'
    }
    wx.navigateTo({
      url: url
    })
  },
  goZX:function(event){
    var id = event.currentTarget.id;
    var type = event.currentTarget.dataset.type;
    var url = '';
    var goType = ''
    // goodsorder playOrder rentOrder
    if(type == '购卡' || type == '购票' || type == '购币'){
      
      if(type == '购卡'){
        goType = 'card'
      }else if(type == '购票'){
        goType = 'ticket'
      }else{
        goType = 'game'
      }
      url = '../cw-order-detai/cw-order-detai?id=' + id + '&type=' + goType
    }
    if(type == '畅饮区' || type == '体验区（买）'){

        url = '../xf-order-detai/xf-order-detai?id=' + id + '&type=' + goType
    }
    if (type == '书城' || type == '体验区（租）' || type == '归还体验玩具（租）'){
      url = '../zp-order-detai/zp-order-detai?id=' + id + '&type=' + goType
    }
    wx.navigateTo({
      url: url,
    })
  },
  goCwOrder:function(event){
    wx.navigateTo({
      url: '../cw-order/cw-order'
    })
  },
  goXfOrder: function (event) {
    wx.navigateTo({
      url: '../xf-order/xf-order'
    })
  },
  bbCamera:function(){
    wx.navigateTo({
      url: '../bb-camera/bb-camera'
    })
  },
  setting:function(){
    wx.navigateTo({
      url: '../setting/setting'
    })
  },
  goCzOrder:function(event){
    wx.navigateTo({
      url: '../cz-order/cz-order'
    })
  },
  goZpOrder: function (event) {
    wx.navigateTo({
      url: '../zp-order/zp-order'
    })
  },
  editInfo:function(event){
    var data = event.currentTarget.dataset;
    var nickname = data.nickname;
    var phone = data.phone;
    var photo = data.photo;
    var sex = data.sex;
    var userinfoid = data.userinfoid
    wx.navigateTo({
      url: '../user_info/user_info?nickname='+nickname+'&phone='+phone+'&photo='+photo+'&sex='+sex+'&userinfoid='+userinfoid
    })
  },
  goMyWallet:function(){
    wx.navigateTo({
      url: '../my_wallet/my_wallet'
    })
  },
  data:{
    data:[],
    order:'',
    pub_url:'',
    userinfoid:'',
    orderId:'',
    notice:'',
    viptype:'',
    sumscore:0
  },
  bbCreat:function(){
    wx.navigateTo({
      url: '../bb-datas/bb-datas'
    })
  },
  onHide:function(){
    console.log('onHide')
  },
  headClick:function(){
    var userinfoid = this.data.userinfoid;
    if(userinfoid){
      wx.navigateTo({
        url: '../user_info/user_info'
      })
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  yqFrid:function(){
    var userinfoid = this.data.userinfoid;
    if (userinfoid) {
      wx.navigateTo({
        url: '../share-main/share-main',
      })
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  onShow:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    this.setData({
      pub_url: pub_url
    })
    var url = '/page/component/index'

    wx.getStorage({
      key: 'user_data',
      complete() {
        wx.hideLoading()
      },
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;

        if(!userinfoid){
          userinfoid = '';
        }

        that.setData({
          userinfoid: userinfoid
        })

        wx.request({
          url: pub_url + '/toysburg/userChildren/searchChildren',
          method: 'GET',
          data: {
            terminal: 'ios',
            userId: userinfoid,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            var notice = '';
            console.log(res)
            var data = res.data.ext;
            if (res.data.retCode == '000') {
              notice = data.firstScore;
              that.setData({
                notice: notice
              })
            } else {

            }
          },
          fail(error) {
            console.log(error)
          }
        })

        wx.request({
          url: pub_url + '/toysburg/user/searchMyInfo',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            shopId: shopid,
            type:'smallProgram'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              that.setData({
                data: res.data.ext.myWalletBean,
                order:res.data.ext.orderBean,
                orderId:res.data.ext.orderBean.id,
                viptype: res.data.ext.myWalletBean.appUserInfo.viptype,
                sumscore: res.data.ext.myWalletBean.appUserInfo.sumscore
              })
            } else {
              that.setData({
                orderId: '',
                viptype: '',
                sumscore:0
              })
            }
          },
          fail(error) {
            that.setData({
              orderId: '',
              viptype: '',
              sumscore:0
            })
          }
        })
      },
      fail(err) {
        that.setData({
          userinfoid: '',
          order: '',
          orderId:'',
          sumscore:0
        })
      }
    })
  },
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    this.setData({
      scroll_height: windowHeight,
      pub_url:pub_url,
      notice:''
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2E1163',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

  },
  onShareAppMessage() {
    return {
      title: '梦幻城堡',
      path: "page/component/index",
    }
  }
})
