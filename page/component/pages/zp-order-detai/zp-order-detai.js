Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    list:'',
    orderNo:'',
    d_yajin: 0,
    r_yajin: 0,
    r_day: 0,
    k_day: 0,
    all_price:0,
    hasGh:''
  },
  copy:function(event){
    var data = event.currentTarget.id;
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onLoad: function (options) {
    var that = this;
    var orderid = options.id;
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    var that = this;
    var userid = '';
    var shopid = '';
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url:pub_url
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userid = json.id;
        shopid = json.shopid;
        wx.request({
          url: pub_url + '/toysburg/order/rentOrderDetail',
          method: 'GET',
          data: {
            terminal: 'android',
            id: orderid,
            userId: userid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              var orderNo = res.data.object.orderNo;
              orderNo = orderNo.slice(orderNo.length - 3);

              var list = res.data.object.detailList;
              var d_yajin = 0;
              var r_yajin = 0;
              var r_day = 0;
              var k_day = 0;
              var all_price = 0;
              var hasGh = true;

              for(var i = 0 ; i < list.length ; i ++ ){
                d_yajin = parseFloat(list[i].price) + d_yajin;
                r_yajin = parseFloat(list[i].totalRent) + r_yajin;
                r_day = parseFloat(list[i].rentDays);
                if(list[i].status != '已归还'){
                  all_price = parseFloat(list[i].price) + all_price;
                  hasGh = false;
                }
               
              }

              that.setData({
               list:res.data,
               orderNo:orderNo,
               hasGh: hasGh,
               d_yajin: d_yajin,
               r_yajin:r_yajin,
               r_day:r_day,
               k_day:k_day,
                all_price: parseInt(all_price * 100) / 100
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
  load:function(){

  }
})
