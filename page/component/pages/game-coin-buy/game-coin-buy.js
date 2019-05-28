Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    list:'',
    banners:'',
    type:'selectCurrencyList',
    ticketClass:'act',
    cardClass:'def',
    gameClass:'def',
    ticketLact: 'l-act',
    cardLact: '',
    gameLact: '',
    obj:'',
    pub_url:'',
    phone:'',
    name:''
  },
  goOrderDetai(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../xf-order-detai/xf-order-detai?id='+id
    })
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  goBuyDetai(opt){
    var id = opt.currentTarget.id;
    var type = opt.currentTarget.dataset.type;
    var url = '';

    url = '../game-buy-detai/game-buy-detai?id=' + id;
   
    wx.navigateTo({
      url: url
    })
  },
  onLoad: function () {
    var that = this;
    var type = 'selectCurrencyList';
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.load(type);
  },
  selectType:function(options){
    var type = options.currentTarget.id;
    this.setData({
      type:type
    })
    console.log(type)
    if (type == 'selectTicketList'){
      this.setData({
        ticketClass: 'act',
        cardClass: 'def',
        gameClass: 'def',
        ticketLact: 'l-act',
        cardLact: '',
        gameLact: ''
      })
    }
    if (type == 'selectCardList'){
      this.setData({
        ticketClass: 'def',
        cardClass: 'act',
        gameClass: 'def',
        ticketLact: '',
        cardLact: 'l-act',
        gameLact: ''
      })
    }
    if (type == 'selectCurrencyList') {
      this.setData({
        ticketClass: 'def',
        cardClass: 'def',
        gameClass: 'act',
        ticketLact: '',
        cardLact: '',
        gameLact: 'l-act'
      })
    }
    this.load(type);
  },
  load:function(type){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url:pub_url
    })
    var url = pub_url + '/toysburg/buyZone/' + type
    
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        userinfoid = json.id;
        shopid = json.shopid;
        var phone = json.mobilephone
        var name = json.nickname
        that.setData({
          name: name,
          phone:phone
        })
        wx.request({
          url: url,
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
              that.setData({
                list:res.data.data,
                obj:res.data.object
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
        var pub_url = getApp().globalData.url;
        wx.request({
          url: pub_url + '/toysburg/advert/getAdvert',
          method: 'GET',
          data: {
            terminal: 'android',
            shopId: shopid,
            userinfoid: userinfoid,
            place:'buyZone'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.setData({
                banners:res.data.data
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
  }
})
