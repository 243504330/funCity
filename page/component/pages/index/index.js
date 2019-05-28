const order = ['demo1', 'demo2', 'demo3']

Page({
  goCz(){
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        if (!userinfoid) {
          wx.navigateTo({
            url: 'pages/login/login'
          })
        } else {
          wx.navigateTo({
            url: 'pages/gold-cz/gold-cz',
          })
        }
      },
      fail(err) {

      }
    })
  },
  goGame: function (event) {
    var id = event.currentTarget.id;
    var url = '';
    url = 'pages/game-buy-detai/game-buy-detai?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  goCard:function(event){
    var id = event.currentTarget.id;
    var url = '';
    url = 'pages/card-buy-detai/card-buy-detai?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  goTicket: function (event) {
    // if (this.data.userinfoid == '') {
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    //   return false;
    // }
    // var id = this.data.ticketid;
    var id = event.currentTarget.id;
    var type = event.currentTarget.dataset.type;
    var url = '';
    if(type == 'single'){
      url = 'pages/buy-detai/buy-detai?id=' + id
    }else{
      url = 'pages/yh-buy-detai/yh-buy-detai?id=' + id
    }

    wx.navigateTo({
      url: url
    })
  },
  goAllBuys(){
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        if (!userinfoid) {
          wx.navigateTo({
            url: 'pages/login/login'
          })
        } else {
          wx.navigateTo({
            url: 'pages/all-buys/all-buys',
          })
        }
      },
      fail(err) {

      }
    })
  },
  goWallet(){
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;

        if(!userinfoid){
          wx.navigateTo({
            url: 'pages/login/login'
          })
        }else{
          wx.navigateTo({
            url: 'pages/my_wallet/my_wallet',
          })
        }

      },
      fail(err){
        
      }
    })

  },
  tapName() {
    wx.navigateTo({
      url: 'pages/youlec/youlec'
    })
  },
  onShareAppMessage() {
    return {
      title: 'scroll-view',
      path: 'page/component/pages/scroll-view/scroll-view'
    }
  },

  data: {
    toView: 'green',
    scroll_height: 0,
    bindKeyInput:123,
    val:12344,
    scrollStatus: true,
    scrollLeft: 460,
    imgUrls: [
      'https://img.tuguaishou.com/ips_banner/96/51/46/9651462abe2f432751d83820493574ef439.png?auth_key=2183817600-0-0-c9aae8bd0b40864659b3252d53a81eaf',
      'https://img.tuguaishou.com/ips_banner/7b/fc/34/7bfc3483b0a98a15e947d53d97fb4875422.jpeg?auth_key=2183817600-0-0-8685b6b6b71a40df9e470e784fcbb7ca',
      'https://img.tuguaishou.com/ips_banner/ae/5a/75/ae5a75d86ddd854252868f2112d79b78109.jpeg?auth_key=2183817600-0-0-297a2cc30cf5b1b3369e9be2f39fe0eb'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiperHeight:113,
    swiperCount:2,
    list:'',
    list_card:'',
    pub_url:'',
    list_game:'',
    gameCount:'',
    cardCount:'',
    ticketCount:'',
    buyPage:0,
    banners:''
  },

  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    var scrollLeft = e.detail.scrollLeft;

    var juli = (e.detail.scrollWidth - scrollLeft) - this.data.scroll_width;

    if (juli < 150) {
      this.setData({
        scrollStatus: false,
        scrollLeft: e.detail.scrollWidth - this.data.scroll_width - 150 + 1
      })
      if (this.data.scrollLeft > (e.detail.scrollWidth - this.data.scroll_width - 150)) {
        this.setData({
          scrollStatus: true
        })
      }
    }
    if (scrollLeft < 80) {
      this.setData({
        scrollStatus: false,
        scrollLeft: 81
      })
      if (this.data.scrollLeft > 80) {
        this.setData({
          scrollStatus: true
        })
      }
    }
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },

  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },
  buyZone:function(e){
  
    var page = e.detail.current;
    var count = '';
    var swiperHeight = '';
    if(page == 0){
      count = this.data.ticketCount;
      swiperHeight = 130 * count + 50;
    }
    if(page == 1){
      count = this.data.cardCount;
      swiperHeight = 130 * count + 20;
    }
    if(page == 2){
      count = this.data.gameCount;
      swiperHeight = 130 * count;
    }

    this.setData({
      swiperHeight: swiperHeight,
      buyPage: page
    })
  },
  goGroup:function(event){
    console.log(event)
    var id = event.currentTarget.id;
    console.log(id)
    wx.navigateTo({
      url: 'pages/' + id + '/' + id 
    })
  },
  loadBanner:function(){
    var pub_url = getApp().globalData.url;
    var that = this
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var shopid = json.shopid;
        var userid =json.id;
        wx.request({
          url: pub_url + '/toysburg/advert/getAdvert',
          method: 'GET',
          data: {
            terminal: 'ios',
            shopId: shopid,
            userinfoid: userid,
            place: 'buyZone'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.setData({
                banners: res.data.data
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
      fail() {
      }
    })
  },
  loadCard: function () {
    var pub_url = getApp().globalData.url;
    var that = this
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var shopid = json.shopid;
        var type = 'selectCardList';
        var url = pub_url + '/toysburg/buyZone/' + type
        wx.request({
          url: url,
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: ''
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var list_card = res.data.data;
              var cardCount = list_card.length;
              console.log(cardCount)
              that.setData({
                list_card: res.data.data,
                cardCount: cardCount
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
      fail() {
      }
    })
  },
  loadGame: function () {
    var pub_url = getApp().globalData.url;
    var that = this
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var shopid = json.shopid;
        var type = 'selectCurrencyList';
        var url = pub_url + '/toysburg/buyZone/' + type
        wx.request({
          url: url,
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: ''
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var list_game = res.data.data;
              var gameCount = list_game.length;
              that.setData({
                list_game: res.data.data,
                gameCount: gameCount
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
      fail() {
      }
    })
  },
  loadBuy:function(){
    var pub_url = getApp().globalData.url;
    var that = this
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var shopid = json.shopid;
        var type = 'selectTicketList';
        var url = pub_url + '/toysburg/buyZone/' + type
        wx.request({
          url: url,
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: ''
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var list = res.data.data;
              var swiperCount = list.length;
              console.log(swiperCount)
              
              that.setData({
                list: res.data.data,
                swiperCount: swiperCount,
                ticketCount:swiperCount,
                swiperHeight: 130 * swiperCount + 50
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
      fail() {
      }
    })
  },
  onShow:function(){
    var pub_url = getApp().globalData.url;
    var that = this;
    var swiperCount = this.data.swiperCount
    this.setData({
      swiperHeight: 130 * swiperCount + 50,
      pub_url: pub_url
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var shopid = json.shopid;
        that.loadBuy();
        that.loadCard();
        that.loadGame();
        that.loadBanner();
      },
      fail() {
        wx.request({
          url: pub_url + '/toysburg/weixin/selectAllShop',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: '',
            shopId: '',
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var shop = res.data.data[0];
              user_data = { 'shopid': shop.id, 'shopname': shop.shopName }
              var user_data = JSON.stringify(user_data);
              wx.setStorage({
                key: 'user_data',
                data: user_data
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
      }
    })
  },
  onHide: function () {
    console.log('wawawa')
  },
  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  pwd:function(){
    var pub_url = getApp().globalData.url;
    var userid = '47612bf69e8c47eb9788a486ade0e411';
    var mobilephone = '18476698507';
    wx.request({
      url: pub_url + '/toysburg/user/modifyUserInfo',
      method: 'GET',
      data: {
        terminal: 'android',
        userinfoid: userid,
        mobilephone: mobilephone,
        nickname:'哇哇哇',
        act:'nickname'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.retCode == '000') {
   
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
  pay:function(){
    var that = this
    var pub_url = this.data.pub_url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var orderno = '123';
        wx.request({
          url: 'http://toys.dev108.com/toysburg/MiniProgramPay/getSignMiniP',
          method: 'GET',
          data: {
            terminal: 'ios',
            orderno: '0002201902191521406667',
            spbill_create_ip: '192.168.1.1',
            openid: '123',
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              
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
  getOpenId: function () {
    var that = this;
    var pub_url = getApp().globalData.url;
    wx.login({
      success(ress) {
        var code = ress.code

        wx.getStorage({
          key: 'user_data',
          success(res) {
            var json = JSON.parse(res.data);

            wx.request({
              url: pub_url + '/toysburg/MiniProgramPay/getOpenId',
              method: 'GET',
              data: {
                terminal: 'ios',
                code: code
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                var data = JSON.parse(res.data.object);
                
                if (res.data.retCode == '000') {
                  getApp().globalData.openid = data.openid

                } else {

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
      }
    })
  },
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    this.getOpenId();

    var that = this
    this.setData({
      scroll_height: windowHeight,
      scroll_width: windowWidth
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2E1163',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  }

})

