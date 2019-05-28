Page({
  onShareAppMessage() {
    var user_id = this.data.userinfoid;
    return {
      title: '免费送票，欢迎体验！',
      path: 'page/component/pages/share/share?user_id=' + user_id
    }
  },
  data:{
    scroll_height: '',
    scroll_width: '',
    phone:'',
    btn:'def_btn',
    user_id:'',
    userinfoid:'',
    focus:true,
    list:'',
    textOne:'',
    textTwo:'',
    statusBarHeight:''
  },
  back:function(){
    wx.navigateBack()
  },
  goticket:function(){
    if (this.data.userinfoid == '') {
      wx.navigateTo({
        url: '../login/login?type=share',
      })
    } else {
      wx.switchTab({
        url: '../my_wallet/my_wallet'
      })
    }
  },
  sub:function(){
    if(this.data.btn == 'def_btn'){
      return false;
    }
    var pub_url = getApp().globalData.url;
    var that = this;
    var user_id = this.data.user_id;
    var phoneNum = this.data.phone

    wx.request({
      url: pub_url + '/toysburg/toysShare/getShareFreeGift',
      method: 'GET',
      data: {
        terminal: 'ios',
        userId: user_id,
        phoneNum:phoneNum
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {

          wx.navigateTo({
            url: '../share-suc/share-suc?phone=' + phoneNum,
          })

        } else {

          wx.showModal({
            title: '提示',
            content: res.data.rtnMsg,
            confirmText: '去首页',
            cancelText: '重新输入',
            success(res) {
              if (res.confirm) {
                // wx.switchTab({
                //   url: '../../index'
                // })
                if(that.data.userinfoid == ''){
                  wx.navigateTo({
                    url: '../login/login?type=share',
                  })
                }else{
                  wx.switchTab({
                    url: '../../index'
                  })
                }
              } else if (res.cancel) {
                console.log('用户点击取消')
                that.setData({
                  phone:'',
                  focus:true
                })
              }
            }
          })
        }
      },
      fail(error) {
        console.log(error)
      }
    })

  },
  onShow:function(){
    var that = this;
    var pub_url = getApp().globalData.url;
    wx.getStorage({
      key: 'user_data',
      complete() {
        wx.hideLoading()
      },
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;

        if (!userinfoid) {
          userinfoid = '';
        }

        that.setData({
          userinfoid: userinfoid
        })

        wx.request({
          url: pub_url + '/toysburg/user/searchShareInfo',
          method: 'GET',
          data: {
            terminal: 'ios',
            userId: userinfoid,
            shopId: shopid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var content = res.data.ext.content;
              var contArr = content.split('小伙伴，共获得');
              var arrOne = contArr[0].split('享');
              var textOne = arrOne[1];
              var arrTwo = contArr[1].split('免'); 
              var textTwo = arrTwo[0];

              that.setData({
                list:res.data.ext,
                textOne:textOne,
                textTwo:textTwo
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
  },
  phone: function (e) {
    var phone = e.detail.value;
    var btn = ''
    this.setData({
      phone: phone
    });
    var phone_d = this.data.phone;
    if (this.data.phone != '') {
      btn = 'act_btn';
    } else {
      btn = 'def_btn';
    }
    this.setData({
      btn: btn
    })
  },
  onReady() {

  },
  onLaunch(opt){

  },
  onLoad(option){
    console.log(option)
    var user_id = option.user_id;
    var that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
    var userinfoid = '';
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2E1163',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        if(!userinfoid){
          userinfoid = '';
        }
        that.setData({
          userinfoid: userinfoid,
          pub_url: pub_url,
          statusBarHeight: statusBarHeight
        })
        console.log(that.data.userinfoid)
      }
    })
    this.setData({
      scroll_height: windowHeight,
      scroll_width: windowWidth,
      user_id:user_id,
      pub_url: pub_url
    })

  },
  drawBall() {

  },

  onUnload() {
   
  }
})
