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
  goXq: function () {
    var imgs = this.data.list.goodsDesc;
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
    count:1,
    cartNum:'',
    subBtn:'',
    dMenu:'block',
    statusBarHeight: ''
  },
  goCart:function(){
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
  joinCart:function(event){
    var num = 1;
    var goodsId = this.data.id;
    var pub_url = this.data.pub_url;
    var that = this;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid
        if(!userinfoid){
          wx.navigateTo({
            url: '../login/login',
          })
          return false
        }
        wx.request({
          url: pub_url + '/toysburg/shoppingCart/setShoppingCart',
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: userinfoid,
            quantity: num,
            goodsId: goodsId,
            type: 'add'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              that.loadCart();
              that.close();
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
  sub:function(){
    console.log(999)
    var shopid = this.data.shopid;
    var id = this.data.ggList.id;
    var userid = this.data.userid
    var type = this.data.type
    var that = this
    var num = this.data.num
    var pub_url = getApp().globalData.url;

    if(type == 'buy'){
      wx.request({
        url: pub_url + '/toysburg/potation/goodsDetermineOrder',
        method: 'GET',
        data: {
          terminal: 'android',
          shopId: shopid,
          userId: userid,
          id: id,
          quantity: num
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
              url: '../cy-buy-detai/cy-buy-detai?id=' + id + '&type=' + type + '&quantity=' + num
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
    }else{

      wx.getStorage({
        key: 'user_data',
        success(res) {
          var json = JSON.parse(res.data);
          var userinfoid = json.id;
          var shopid = json.shopid
          wx.request({
            url: pub_url + '/toysburg/shoppingCart/setShoppingCart',
            method: 'GET',
            data: {
              terminal: 'android',
              shopId: shopid,
              userinfoid: userinfoid,
              quantity: num,
              goodsId: id,
              type: 'add'
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data.retCode == '000') {
                console.log(res)
                that.loadCart();
                that.close();
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
    }
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
  loadCart:function(){
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
        if(!userinfoid){
          that.setData({
            cartNum:0
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
            if (res.data.retCode == '000') {
              console.log(res)
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
  xuanGG:function(event){
    var ggClass = event.currentTarget.id
    var allList = this.data.allList

    console.log(allList)

    for(var i = 0; i < allList.length; i++){
      if (ggClass == allList[i].goodsSpec){
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
    var shopid = this.data.shopid;
    var id = this.data.id;
    var type = event.currentTarget.id;
    var that = this
    var btnType = '';
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        if(!userinfoid){
          wx.navigateTo({
            url: '../login/login',
          })
          return false
        }
        if (type == 'buy') {
          btnType = '确认下单'
        } else {
          btnType = '加入购物车'
        }


        that.setData({
          subBtn: btnType,
          type: type
        })

        var allList = that.data.allList;

        if (allList.length > 1) {
          var ggList = allList[0]
          that.setData({
            dBox: 'block',
            dMenu: 'none',
            ggList: ggList,
            ggClass: ggList.goodsSpec,
            allList: allList
          })
        } else {
          var num = that.data.count

          if (type == 'cart') {
            that.joinCart()
          } else {
            wx.navigateTo({
              url: '../cy-buy-detai/cy-buy-detai?id=' + id + '&quantity=' + num
            })
          }
        }
      }
    })

    return false;

    console.log(shopid);
    console.log(id)

    wx.request({
      url: 'http://toys.dev108.com/toysburg/potation/goodsSpec',
      method: 'GET',
      data: {
        terminal: 'android',
        shopId: shopid,
        goodsId: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        return false
        if (res.data.retCode == '000') {
          var count = res.data.data;

          if(count.length > 1){
            var ggList = count[0]
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
    console.log(like)
    var id = this.data.id;
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
    var pub_url = getApp().globalData.url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        if(!userinfoid){
          wx.navigateTo({
            url: '../login/login',
          })
          return false
        }
        wx.request({
          url: pub_url + '/toysburg/potation/likeGoods',
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
    this.loadCart();
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
      statusBarHeight: statusBarHeight
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = getApp().globalData.url;
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;
        that.setData({
          userid:userinfoid,
          shopid:shopid
        })
        wx.request({
          url: pub_url + '/toysburg/potation/goodsDetails',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            shopId:shopid,
            id:id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              var like = '';
              if(res.data.ext.like == true){
                like = 'hxin';
              }else{
                like = 'bxin';
              }
              that.setData({
                list:res.data.object,
                like:like,
                id:id,
                likeNum:res.data.object.likeNumStr,
                shopid:shopid,
                allList:res.data.data
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
