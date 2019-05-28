Page({
  goUser() {
    wx.navigateTo({
      url: '../user/user'
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
    pub_url:'',
    cartNum:0,
    menu:'none',
    allList:'',
    ggClass:'',
    num:1,
    img:''
  },
  goVideo:function(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../cy-video-bf/cy-video-bf?id='+id
    })
  },
  shopcart:function(){
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        if (!userinfoid) {
          wx.navigateTo({
            url: '../login/login',
          })
          return false
        }
        wx.navigateTo({
          url: '../shop-cart/shop-cart'
        })
      }
    })
  },
  close:function(){
    this.setData({
      menu: 'none'
    })
  },
  jian: function () {
    var num = this.data.num - 1;
    if (num <= 0) {
      num = 1;
    }
    this.setData({
      num: num
    })
  },
  jia: function () {
    var num = this.data.num + 1;
    this.setData({
      num: num
    })
  },
  xuanGG: function (event) {
    var ggClass = event.currentTarget.id
    var allList = this.data.allList

    console.log(allList)

    for (var i = 0; i < allList.length; i++) {
      if (ggClass == allList[i].goodsSpec) {
        this.setData({
          ggList: allList[i],
          goodsId:allList[i].id
        })
      }
    }

    this.setData({
      ggClass: ggClass
    })
  },
  zjCart: function () {
    var goodsId = this.data.goodsId;
    var quantity = this.data.num;
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid
        wx.request({
          url: pub_url + '/toysburg/shoppingCart/setShoppingCart',
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: userinfoid,
            quantity: quantity,
            goodsId: goodsId,
            type: 'add'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.loadCart();
              that.setData({
                menu: 'none'
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
  confirmCart:function(event){
    var goodsId = this.data.goodsId;
    var quantity = this.data.num;
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid
        wx.request({
          url: pub_url + '/toysburg/shoppingCart/setShoppingCart',
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: userinfoid,
            quantity: quantity,
            goodsId: goodsId,
            type: 'add'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              wx.showToast({
                title: res.data.rtnMsg,
                icon: 'none',
                duration: 2000
              })
              that.loadCart();
              that.setData({
                menu: 'none'
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
  addCart: function (event){

    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    var quantity = this.data.num;
    var goodsId = event.currentTarget.id;

    this.setData({
      goodsId: goodsId
    })

    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;
        console.log(userinfoid)
        if(!userinfoid){
          wx.navigateTo({
            url: '../login/login',
          })
          return false
        }
        that.setData({
          userid: userinfoid,
          shopid: shopid
        })
        wx.request({
          url: pub_url + '/toysburg/potation/goodsDetails',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            shopId: shopid,
            id: goodsId
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              var list = res.data.data;
              var count = list.length;

              console.log(count > 1)
              
              if(count > 1){
                that.setData({
                  menu: 'block',
                  img: res.data.object.image,
                  ggList:res.data.data[0],
                  allList: res.data.data,
                  ggClass: res.data.data[0].goodsSpec
                })
              }else{
                that.confirmCart();
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
  loadCart:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    console.log(1234444)
    wx.getStorage({
      key: 'user_data',
      success(res) {
        console.log(res)
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid
        if(!userinfoid){
          that.setData({
            cartNum: 0
          })
          return false
        }
        wx.request({
          url: pub_url + '/toysburg/shoppingCart/getShoppingCartNum ',
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: userinfoid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var cartNum = res.data.object.productCount
              that.setData({
                cartNum: cartNum
              })
            } else {
              wx.showToast({
                title: res.data.rtnMsg,
                icon: 'none',
                duration: 2000
              })
              that.setData({
                cartNum: 0
              })
            }
          },
          fail(error) {
            console.log(error)
            that.setData({
              cartNum: 0
            })
          }
        })
      },
      fail(err) {
        console.log(3223)
        that.setData({
          cartNum: 0
        })
      }
    })
  },
  onShow:function(){
    this.loadCart();
  },
  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;
    this.setData({
      scroll_height: windowHeight,
      pub_url:pub_url
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    var that = this;
    var userinfoid = '';
    var shopid = '';
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid
        wx.request({
          url: pub_url + '/toysburg/potation/goodsHomePage',
          method: 'GET',
          data: {
            terminal: 'android',
            shopId:shopid,
            userId: userinfoid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              that.setData({
                list:res.data.data,
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
  onShareAppMessage() {
    return {
      title: 'webview',
      path: ''
    }
  },
})
