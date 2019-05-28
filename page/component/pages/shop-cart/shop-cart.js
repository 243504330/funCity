Page({
  goTicketDetail(event){

  },
  data:{
    list:'',
    pub_url:'',
    cartId:'',
    status:'',
    priceRes:''
  },
  goodsCheck:function(event){
    var that = this;
    var cartId = this.data.cartId;
    var status = event.currentTarget.dataset.status;
    var goodsId = event.currentTarget.id

    if(status == 'Y'){
      status = 'N'
    }else{
      status = 'Y'
    }
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
          url: pub_url + '/toysburg/shoppingCart/setCartIsChecked',
          method: 'GET',
          data: {
            terminal: 'android',
            cartId: cartId,
            goodsId:goodsId,
            type: 'good',
            status: status
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.load();
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
  subCart:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    var cartId = this.data.cartId;
    var status = 'N';
    var list = this.data.list;

    for (var i = 0 ; i < list.length ; i ++){
      if(list[i].ischecked == 'Y'){
        status = 'Y'
      }
    }

    if(status == 'N'){
      wx.showToast({
        title: '请添加商品',
        icon: 'none',
        duration: 2000
      })
      return false
    }

    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid
        wx.request({
          url: pub_url + '/toysburg/shoppingCart/spCartComfirm',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            cartId: cartId
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              var id = that.data.cartId
              var content = res.data.ext.warmPrompt.content;
              var goldPrice = '';
              var cashPrice = '';
              var list = res.data.ext.shoppingCart.productList;
              list = JSON.stringify(list);
              var discount = res.data.ext.chargeDiscount;
              var sumgold = res.data.ext.sumgold;
              var vip = res.data.ext.vipType;
              if(res.data.ext.vipType == 'normal'){
                goldPrice = res.data.ext.shoppingCart.priceBean.goldPrice;
                cashPrice = res.data.ext.shoppingCart.priceBean.price;
              }else{
                goldPrice = res.data.ext.shoppingCart.priceBean.vipGoldPrice;
                cashPrice = res.data.ext.shoppingCart.priceBean.vipPrice;
              }
              wx.navigateTo({
                url: '../cy-cart-detai/cy-cart-detai?content='+content+'&discount='+discount+'&goldPrice='+goldPrice+'&cashPrice='+cashPrice+'&sumgold='+sumgold+'&list='+list+'&vip='+vip,
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
  delCart:function(event){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    var quantity = 1;
    var goodsId = event.currentTarget.id;
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
            type: 'sub'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              that.load();
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
  addCart: function (event) {
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = this.data.pub_url;
    var quantity = 1;
    var goodsId = event.currentTarget.id;
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
              console.log(res)
              that.load();
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
  check:function(){
    var that = this;
    var cartId = this.data.cartId;
    var status = this.data.status;
    if(status == 'Y'){
      status = 'N'
    }else{
      status = 'Y'
    }
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
          url: pub_url + '/toysburg/shoppingCart/setCartIsChecked',
          method: 'GET',
          data: {
            terminal: 'android',
            cartId:cartId,
            goodsId:'',
            type:'all',
            status:status
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.load();
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
  load:function(){
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
          url: pub_url + '/toysburg/shoppingCart/showShoppingCartList',
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
              var list = res.data.object.productList
              var cartId = res.data.object.id;
              var status = res.data.object.ischecked;
              var priceRes = res.data.object.priceBean.price;
              var pries = 0;
              for(var i = 0 ; i < list.length ; i ++){
                if(list[i].ischecked == 'Y'){
                  pries = pries + (parseFloat(list[i].quantity) * parseFloat(list[i].salePrice));
                } 
              }
              that.setData({
                list: list,
                cartId: cartId,
                status: status,
                priceRes: pries
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

      }
    })
  },
  onShow:function(){
    this.load();
  },
  onLoad: function (options) {
    var that = this;
    var type = options.id;
    var typename = '购物车';
    wx.setNavigationBarTitle({
      title: typename,
      success: function (res) {
        // success
      }
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
