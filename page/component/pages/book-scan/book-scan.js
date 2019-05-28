Page({
  goTicketDetail(event){

  },
  data:{
    list:'',
    typename:'',
    hasJD:'none',
    carList:''
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onLoad: function (options) {
    var that = this;
    var type = options.id;
    var typename = '阅读书城';

    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })

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
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var pub_url = getApp().globalData.url;
        wx.request({
          url: pub_url + '/toysburg/bookCity/bookCitydescribe',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            shopId:shopid
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
                list:list,
                carList:res.data.ext.myCard
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
