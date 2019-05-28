Page({
  goTicketDetail(event){

  },
  data:{
    list:'',
    item:'',
    num:1,
    amount:0,
    allAmount:0,
    gameCoin:0,
    coin:0,
    idNo:0,
    btnFlag:true,
    modal_message:'',
    modal_flag:'none',
    pageType:''
  },
  getBack:function(){
    var pageType = this.data.pageType;
    if(pageType == 'index'){
      wx.navigateBack();
      return false
    }
    wx.redirectTo({
      url: '../gamecoin/gamecoin',
    })
  },
  goBuyCoin:function(){
    wx.redirectTo({
      url: '../game-coin-buy/game-coin-buy',
    })
  },
  sub:function(){
    var that = this;
    wx.showLoading({
      title: '加载中···',
    })
    if(this.data.btnFlag == false){
      return false;
    }
    this.setData({
      btnFlag:false
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        console.log(json)
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        var idNo = that.data.idNo;
        var times = that.data.num;
        var price = that.data.amount;
        wx.request({
          url: pub_url + '/toysburg/gameMachines/startPlayGame',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            IDNo: idNo,
            shopId: shopid,
            times: times,
            price:price
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            that.setData({
              btnFlag:true
            })
            
            if (res.data.retCode == '000') {
              wx.hideLoading()
              wx.redirectTo({
                url: '../buy-success/buy-success?type=toubi',
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
            wx.hideLoading()
            that.setData({
              btnFlag: true
            })
            wx.showModal({
              title: '温馨提示',
              content: '请求超时，请稍后重试',
              confirmText: '确认',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      },
      fail(err) {

      }
    })

  },
  jia:function(){
    var num = parseInt(this.data.num);
    var amount = parseInt(this.data.amount);
    num = num + 1;
    
    if(num > 10){
      num = 10;
      return false
    }
    var gameCoin = parseInt(this.data.gameCoin);
    console.log(parseInt(gameCoin) - num * amount)
    var canBuy = parseInt(gameCoin) - num * amount;
    if (canBuy < 0 ){
      return false;
    }
    this.setData({
      num:num,
      allAmount: num * amount,
      coin: parseInt(gameCoin) - num * amount
    })
  },
  jian:function(){
    var num = parseInt(this.data.num);
    var amount = parseInt(this.data.amount);
    num = num - 1;
    if (num < 1) {
      num = 1
      return false
    }
    var gameCoin = parseInt(this.data.gameCoin);

    console.log(num)
    console.log(gameCoin)
    console.log(amount)

    this.setData({
      num: num,
      allAmount: num * amount,
      coin:parseInt(gameCoin) - num * amount
    })
  },
  load:function(){

  },
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var pageType = options.pageType
    this.setData({
      pageType:pageType
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    var idNo = options.idNo;
    wx.showLoading({
      title: '加载中···',
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        that.setData({
          idNo: idNo
        })
        wx.request({
          url: pub_url + '/toysburg/gameMachines/queryGameAmount',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userinfoid,
            IDNo: idNo,
            shopId: shopid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            wx.hideLoading()
            if (res.data.retCode == '005' || res.data.retCode == '333'){

              that.setData({
                modal_flag:'block',
                modal_message: res.data.rtnMsg
              })
             
              return false
            }
            if (res.data.retCode == '000') {
              var result = JSON.parse(res.data.object);
              var gameCoin = parseFloat(res.data.ext.sumgamecurrency);
              var aCoin = parseInt(gameCoin) - parseInt(result.Data.Data[0].Amount);
              if(aCoin < 0){
                aCoin = 0;
              }

             
              that.setData({
                amount:result.Data.Data[0].Amount,
                allAmount: result.Data.Data[0].Amount,
                gameCoin: gameCoin,
                coin: aCoin
              })
              wx.hideLoading();
            } else {
              wx.hideLoading()
              wx.showModal({
                title: '温馨提示',
                content: res.data.rtnMsg,
                confirmText: '返回',
                showCancel:false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack()
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          },
          fail(error) {
            wx.hideLoading()
            wx.showModal({
              title: '温馨提示',
              content: '请求超时，请稍后重试',
              confirmText: '返回',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      },
      fail(err) {

      }
    })
  }
})
