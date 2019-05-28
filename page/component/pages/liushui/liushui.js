Page({
  goTicketDetail(event){

  },
  data:{
    list:'',
    typename:'',
    hasJD:'none'
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onLoad: function (options) {
    var that = this;
    var type = options.id;
    var typename = '';
    if(type == 'gold'){
      typename = '冻结余额'
    }else if(type == 'cash'){
      typename = '现金押金'
    }
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
          url: pub_url + '/toysburg/myWallet/getDepositRecord',
          method: 'GET',
          data: {
            terminal: 'android',
            userinfoid: userinfoid,
            pageCurrent:0,
            type:type,
            pageSize:100
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data.data)
            if (res.data.retCode == '000') {

              if(res.data.data == ''){
                that.setData({
                  hasJD:'block'
                })
              }else{
                that.setData({
                  list: res.data.data,
                  typename: typename
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
  }
})
