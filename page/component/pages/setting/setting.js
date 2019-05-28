Page({
  setPwd:function(){
    var pwd = this.data.pwd;
    var url = '';
    if(pwd == ''){
      url = '../set-pwd-new/set-pwd-new';
    }else{
      url = '../set-pwd/set-pwd';
    }
    wx.navigateTo({
      url: url
    })
  },
  goTicketDetail(event){

  },
  data:{
    list:'',
    hasTicket:'none',
    hasList:'none',
    pub_url:'',
    pwdleng:'',
    pwd:''
  },
  out:function(){
    wx.showModal({
      title: '温馨提示',
      content: '是否退出?',
      success(res) {
        if (res.confirm) {
          wx.clearStorage();
          wx.navigateBack({
            delta: 3
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  onShow: function () {
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    this.setData({
      pub_url: pub_url,
      orderId: ''
    })
    var url = '/page/component/index'

    wx.showLoading()

    wx.getStorage({
      key: 'user_data',
      complete() {
        wx.hideLoading()
      },
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;
        if (!userinfoid) {
          userinfoid = '';
        }
        that.setData({
          userinfoid: userinfoid
        })
        wx.request({
          url: pub_url + '/toysburg/user/searchMyInfo',
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
                pwd: res.data.ext.myWalletBean.appUserInfo.tradepassword
              })
              console.log(that.data.data)
            } else {

            }
          },
          fail(error) {

          }
        })
      },
      fail(err) {
        that.setData({
          userinfoid: '',
          order: ''
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url: pub_url
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  }
})
