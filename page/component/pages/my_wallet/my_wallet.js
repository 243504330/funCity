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
  goOther: function (event) {
    var userinfoid = this.data.userinfoid;
    if (userinfoid) {
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  goYeMx:function(){
    var url = '';
    var userinfoid = this.data.userinfoid;
    if (userinfoid) {
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }

    wx.navigateTo({
      url :'../yue-ls/yue-ls'
    })
  },
  goCard: function () {
    var url = '';
    var userinfoid = this.data.userinfoid;
    if (userinfoid) {
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }
    if(this.data.myCardNum == '0'){
      url = '../card-yh/card-yh?type=cardType'
    }else{
      url = '../card/card'
    }
    wx.navigateTo({
      url: url
    })
  },
  goScore: function (event){
    var score = event.currentTarget.id;
    var userinfoid = this.data.userinfoid;
    if (userinfoid) {
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }
    wx.navigateTo({
      url: '../score/score?score=' + score
    })
  },
  goLiuShui(event){
    var id = event.currentTarget.id;
    var userinfoid = this.data.userinfoid;
    if (userinfoid) {
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }
    wx.navigateTo({
      url: '../liushui/liushui?id=' + id
    })
  },
  goGameCoin() {
    var userinfoid = this.data.userinfoid;
    if (userinfoid) {
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }
    wx.navigateTo({
      url: '../gamecoin/gamecoin'
    })
  },
  goTicket(){
    var userinfoid = this.data.userinfoid;
    if (userinfoid) {
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }
    wx.navigateTo({
      url: '../ticket/ticket'
    })
  },
  goCardDetail(event) {
    var userinfoid = this.data.userinfoid;
    var id = event.currentTarget.id;
    var isActivation = event.currentTarget.dataset.act;


    if (userinfoid) {
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
      return false
    }

    if(isActivation == 'Y'){
      wx.navigateTo({
        url: '../card-detai/card-detai?id=' + id + '&isActivation=' + isActivation
      })
    }else{


      var pub_url = getApp().globalData.url;
      wx.getStorage({
        key: 'user_data',
        success(res) {
          var json = JSON.parse(res.data);
          var userinfoid = json.id;
          var shopid = json.shopid;
          wx.request({
            url: pub_url + '/toysburg/userChildren/selectUserChildren',
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

              if (res.data.retCode == '000') {
                if (res.data.data == '') {
                  wx.showModal({
                    title: '提示',
                    content: '激活卡需绑定宝宝档案，是否新建宝宝档案？',
                    confirmText: '新建档案',
                    cancelText: '再想想',
                    success(res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../bb-creat/bb-creat?id='+id
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                } else {
                  wx.navigateTo({
                    url: '../bb-bind/bb-bind?id='+id
                  })
                }
              } else {
              }
            },
            fail(error) {
              console.log(error)
            }
          })
        }
      })



    }
    
    return false
    
    
    wx.navigateTo({
      url: '../card-detai/card-detai?id=' + id + '&isActivation=' + isActivation
    })
  },
  data:{
    userinfoid: '',
    sumdeposit:0,
    cashdeposit:0,
    sumscore:0,
    myCardNum:0,
    sumgold:0,
    myTicketNum:0,
    sumgamecurrency:0,
    scroll_height:0,
    cartList:[],
    discount:''
  },
  onShow:function(){
    
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var url = getApp().globalData.url;
   
    wx.getStorage({
      key: 'user_data',
      complete(){
        wx.hideLoading();
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
          url: url + '/toysburg/myWallet/findMyWallet',
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
              var userinfo = res.data.object.appUserInfo;
              var obj = res.data.object;
              console.log(obj)
              console.log(obj.cardList)
              that.setData({
                sumdeposit: userinfo.sumdeposit,
                cashdeposit: userinfo.cashdeposit,
                sumscore: userinfo.sumscore,
                myCardNum: obj.myCardNum,
                sumgold: userinfo.sumgold,
                myTicketNum: obj.myTicketNum,
                sumgamecurrency: userinfo.sumgamecurrency,
                cardList: obj.cardList,
                discount: obj.discount
              })
            } else {

            }
          },
          fail(error) {
            console.log(error)
          }
        })
      },
      fail(err) {
        console.log(err)
        that.setData({
          userinfoid: '',
          sumdeposit: 0,
          cashdeposit: 0,
          sumscore: 0,
          myCardNum: 0,
          sumgold: 0,
          myTicketNum: 0,
          sumgamecurrency: 0,
          cardList: ''
        })
      }
    })
  },
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    wx.showLoading()
    this.setData({
      scroll_height: windowHeight
    })
  },
  onShareAppMessage() {
    return {
      title: '梦幻城堡',
      path: "page/component/index",
    }
  }
})
