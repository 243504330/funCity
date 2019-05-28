const order = ['demo1', 'demo2', 'demo3']

Page({
  launchAppError(e) {
    console.log(e.detail.errMsg)
    var msg = e.detail.errMsg;
    if (msg == 'invalid scene'){
      wx.showModal({
        title: '',
        content: '下载APP立即体验！',
        showCancel: false,
        success(res) {

        }
      })
    }
  },
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
  saoma() {
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
          wx.scanCode({
            onlyFromCamera: true,
            success(res) {
              var urlArr = res.result;
              var urlFlag = (urlArr.indexOf("PlayId") != -1);
              if (urlFlag == false) {
                wx.showToast({
                  title: '不是有效的二维码',
                  icon: 'none',
                  duration: 2000
                })
                return false
              }
              var arrX = urlArr.split('?');
              function getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = arrX[1].substr().match(reg);
                if (r != null) return unescape(r[2]);
                return null;
              }
              var idNo = getQueryString('PlayId');
              if (!idNo) {
                wx.showToast({
                  title: '不是有效的二维码',
                  icon: 'none',
                  duration: 2000
                })
                return false
              }

              wx.navigateTo({
                url: 'pages/game-tou/game-tou?idNo=' + idNo + '&pageType=index'
              })
            }
          })
        }
      },
      fail(err) {

      }
    })
  },
  bindBanner:function(event){
    var bannerPage = event.detail.current;
    this.setData({
      bannerPage:bannerPage
    })
  },
  gobo:function(){
    wx.navigateTo({
      url: 'pages/bb-creat/bb-creat?type=xgg',
    })
  },
  goApp:function(){
    wx.showModal({
      title: '',
      content: '前往下载APP',
      showCancel:false,
      success(res) {
        wx.navigateTo({
          url: 'pages/share/share',
        })
      }
    })
  },
  choseTitle:function(e){
    console.log(e)
    var page = e.currentTarget.id;
    this.setData({
      currentTab: page
    })
  },
  goGame: function (event) {
    var id = event.currentTarget.id;
    var userinfoid = this.data.userinfoid;

    if(userinfoid == ''){
      wx.navigateTo({
        url: 'pages/login/login'
      })
      return false;
    }

    var url = '';
    url = 'pages/game-buy-detai/game-buy-detai?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  goCard:function(event){
    var id = event.currentTarget.id;
    var userinfoid = this.data.userinfoid;
    if (userinfoid == '') {
      wx.navigateTo({
        url: 'pages/login/login'
      })
      return false;
    }
    var url = '';
    url = 'pages/card-buy-detai/card-buy-detai?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  goTicket: function (event) {
    var userinfoid = this.data.userinfoid;
    if (userinfoid == '') {
      wx.navigateTo({
        url: 'pages/login/login'
      })
      return false;
    }
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
      title: '梦幻城堡',
      path: "page/component/index",
    }
  },
  data: {
    toView: 'green',
    scroll_height: 0,
    bindKeyInput:123,
    val:12344,
    scrollStatus: true,
    scrollLeft: 460,
    imgUrls: [],
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
    banners:'',
    inMain:'none',
    inLoad:'block',
    animationData:{},
    userinfoid:'',
    currentTab:0,
    notice:'',
    bannerPage:'',
    rectTop:0,
    rectHeight:0
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

    console.log(juli)

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
    let windowWidth = wx.getSystemInfoSync().windowWidth;
    console.log(windowWidth);
    if(page == 0){
      count = this.data.ticketCount;
      swiperHeight = 130 * count + 100;
      console.log(swiperHeight)
    }
    if(page == 1){
      count = this.data.cardCount;
      swiperHeight = 130 * count + 50;
    }
    if(page == 2){
      count = this.data.gameCount;
      swiperHeight = 130 * count + 30;
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
  loadGongGao:function(){
    var pub_url = getApp().globalData.url;
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        if (!userinfoid) {
          that.setData({
            notice: ''
          })
        } else {
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
              console.log(res)
              var notice = '';
              var data = res.data.ext;
              if (res.data.retCode == '000') {
                notice = data.notChildren;
                that.setData({
                  notice:notice
                })
              } else {
                that.setData({
                  notice: ''
                })
              }
            },
            fail(error) {
              console.log(error)
              that.setData({
                notice: ''
              })
            }
          })
        }
      },
      fail(err) {
        that.setData({
          notice: ''
        })
      }
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
                swiperHeight: 130 * swiperCount + 100
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
    var swiperCount = this.data.swiperCount;
    var rectHeight = getApp().globalData.rectHeight;
    var rectTop = getApp().globalData.rectTop; 
    this.setData({
      pub_url: pub_url,
      inMain:'block',
      inLoad:'none',
      rectHeight: rectHeight,
      rectTop: rectTop
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var shopid = json.shopid;
        var userinfoid = json.id;

        if(!userinfoid){
          userinfoid = '';
        }
        that.setData({
          userinfoid: userinfoid
        })

        that.loadBanner();
        that.loadGongGao();
      },
      fail() {
        console.log('fail')
        that.setData({
          userinfoid: ''
        })
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
              that.loadBuy();
              that.loadCard();
              that.loadGame();
              that.loadBanner();
              that.loadGongGao();
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
  onHide: function () {
    console.log('wawawa')
  },
  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  pwd:function(){

  },
  pay:function(){

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
                console.log(res)
                var data = JSON.parse(res.data.object);

                console.log(data.session)
                
                if (res.data.retCode == '000') {
                  getApp().globalData.openid = data.openid
                  getApp().globalData.session_key = data.session_key
                  getApp().globalData.unionid = data.unionid

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
    
    var that = this;
    this.getOpenId();

    const animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.opacity(0.8).step()

    setTimeout(function () {
      animation.opacity(1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)

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
      wx.getStorage({
        key: 'user_data',
        success(res) {
          var json = JSON.parse(res.data);
          var shopid = json.shopid;
          var userinfoid = json.id;

          if (!userinfoid) {
            userinfoid = '';
          }
          that.setData({
            userinfoid: userinfoid
          })

          that.loadBuy();
          that.loadCard();
          that.loadGame();
          that.loadBanner();
          that.loadGongGao();
        }
      })



  }

})

