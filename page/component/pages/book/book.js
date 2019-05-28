Page({
  goTicketDetail(event){

  },
  buyTicket:function(){
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        var barCode = that.data.barCode;
        console.log(userinfoid)
        if(!userinfoid){
          wx.navigateTo({
            url: '../login/login'
          })
          return false
        }
        wx.request({
          url: pub_url + '/toysburg/bookCity/checkBuyBooksCity',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            shopId: shopid,
            type: 'ticket'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var id = res.data.ext.ticket.id;
              wx.navigateTo({
                url: '../buy-detai/buy-detai?id=' + id
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
  buyCard:function(){
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        var barCode = that.data.barCode;
        if (!userinfoid) {
          wx.navigateTo({
            url: '../login/login'
          })
          return false
        }
        wx.request({
          url: pub_url + '/toysburg/bookCity/checkBuyBooksCity',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            shopId: shopid,
            type:'card'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var id = res.data.ext.card.id;
              wx.navigateTo({
                url: '../card-buy-detai/card-buy-detai?id='+id
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
  scan:function(){
    var that = this
    wx.scanCode({
      success(res) {
        var barCode = res.result;
        that.setData({
          barCode:barCode
        })
        that.setBook();
      },
      fail(){
        wx.showToast({
          title: '无效的商品',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  data:{
    list:'',
    typename:'',
    hasJD:'none',
    carList:'',
    bookList:'',
    pub_url:'',
    barCode:'',
    bookLenght:0,
    formId: ''
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var formId = e.detail.formId;

    this.setData({
      formId: formId
    })

  },
  subZS:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        var barCode = that.data.barCode;
        var openId = getApp().globalData.openid;
        var formId = that.data.formId;

        wx.request({
          url: pub_url + '/toysburg/bookCity/submitBooksSpCart',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            shopId: shopid,
            openId:openId,
            formId:formId
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              wx.hideLoading()
              wx.redirectTo({
                url: '../buy-success/buy-success?type=zhushu'
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
            wx.showToast({
              title: '请求超时',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail(err) {

      }
    })
  },
  scanBook:function(){
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        var barCode = that.data.barCode;
        wx.request({
          url: pub_url + '/toysburg/bookCity/sweepBorrowBook',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.scan();
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
  setBook:function(){
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        var barCode = that.data.barCode;
        wx.request({
          url: pub_url + '/toysburg/bookCity/setBooksSpCart',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            shopId: shopid,
            type:'add',
            barCode: barCode
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.bookList();
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
  delBook:function(optinos){
    var id = optinos.currentTarget.id;
    var that = this;
    console.log(id)
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        var barCode = id;
        wx.request({
          url: pub_url + '/toysburg/bookCity/setBooksSpCart',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            shopId: shopid,
            type: 'sub',
            barCode: barCode
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.bookList();
              wx.showToast({
                title: res.data.rtnMsg,
                icon: 'none',
                duration: 2000
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
  bookList:function(){
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        wx.request({
          url: pub_url + '/toysburg/bookCity/showBooksSpCart',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            shopId: shopid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var bookList = res.data.ext.booksSpCart.productList;
              console.log(bookList)
              that.setData({
                bookList: bookList
              })
              if (bookList == '') {
                wx.setNavigationBarTitle({
                  title: '悦读书城',
                  success: function (res) {
                    // success
                  }
                })
              } else {
                wx.setNavigationBarTitle({
                  title: '租书架',
                  success: function (res) {
                    // success
                  }
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
      fail(err) {

      }
    })
  },
  onShow:function(){
    this.bookList();
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        if (!userinfoid) {
          userinfoid = '';
        }
        that.setData({
          pub_url: pub_url
        })
        wx.request({
          url: pub_url + '/toysburg/bookCity/bookCitydescribe',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            shopId: shopid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var list = [];
              list[0] = res.data.ext.oneMap;
              list[1] = res.data.ext.twoMap;
              list[2] = res.data.ext.threeMap;
              that.setData({
                list: list,
                carList: res.data.ext.myCard
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
    var that = this;
    var type = options.id;
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
