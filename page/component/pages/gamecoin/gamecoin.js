Page({
  goTicketDetail(event){

  },
  data:{
    list:'',
    item:'',
    nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'padding-left:5%;padding-right:5%;font-size:24rpx;color:#aaaaaa;padding-top:40rpx;'
      },
      children: [{
        type: 'text',
        text: ''
      }]
    }]
  },
  goGameBuy(){
    wx.navigateTo({
      url: '../game-coin-buy/game-coin-buy'
    })
  },
  goCoinSend(){
    var gameCoin = this.data.item.sumgamecurrency;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var urlArr = res.result;
        var urlFlag = (urlArr.indexOf("PlayId") != -1);
        if(urlFlag == false){
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
        if(!idNo){
          wx.showToast({
            title: '不是有效的二维码',
            icon: 'none',
            duration: 2000
          })
          return false
        }
        
        wx.redirectTo({
          url: '../game-tou/game-tou?idNo=' + idNo + '&gameCoin=' + gameCoin
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        wx.request({
          url: pub_url + '/toysburg/myWallet/findGameCurrencyDes',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            pageCurrent:0,
            pageSize:100
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.retCode == '000') {
              console.log(res)
              that.setData({
                list:res.data.data,
                item:res.data.ext
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
