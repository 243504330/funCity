Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    list:'',
    pub_url:'',
    type:'',
    scroll_height:'',
    currentTab:0,
    shenhe_list:'',
    guihuan_list:'',
    dai_list:''
  },
  chose(options) {
    var id = options.currentTarget.id;
    var currentTab = 0;
    if (id == '') {
      currentTab = 0
    }
    if (id == 'pickup') {
      currentTab = 1
    }
    if (id == 'rented') {
      currentTab = 2
    }
    if (id == 'returned') {
      currentTab = 3
    }
    this.setData({
      type: id,
      currentTab: currentTab
    })
    this.load();
  },
  goOrderDetai(event){
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../zp-order-detai/zp-order-detai?id='+id
    })
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  upper: function () {
    wx.startPullDownRefresh()
  },
  onPullDownRefresh() {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    setTimeout(function () {
      wx.stopPullDownRefresh({
        complete(res) {
          wx.hideToast()
          console.log(res, new Date())
        }
      })
    }, 1000)

  },
  bindOrder: function (event) {
    var page = event.detail.current;
    console.log(page)
    var id = '';
    if (page == 0) {
      id = ''
    }
    if (page == 1) {
      id = 'pickup'
    }
    if (page == 2) {
      id = 'rented'
    }
    if (page == 3) {
      id = 'returned'
    }
    this.setData({
      type: id
    })

  },
  onLoad: function (options) {
    var that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({
      scroll_height: windowHeight
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.load();
  },
  load:function(){
    var that = this;
    var userid = '';
    var shopid = '';
    var pub_url = getApp().globalData.url;
    var type = '';
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
          url: pub_url + '/toysburg/order/rentOrderList',
          method: 'GET',
          data: {
            terminal: 'android',
            userId: userid,
            status: type,
            pageCurrent:0,
            pageSize:100
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            if (res.data.retCode == '000') {
              that.setData({
                list:res.data.data
              })
              if (that.data.type == 'rented') {

              }
              console.log(that.data.list)
              var datas = that.data.list;
              var shenhe_list = '';
              var guihuan_list = '';
              var dai_list = '';
              for(var i = 0 ; i < datas.length; i ++){
                if (datas[i].status == '待审核'){
                  shenhe_list = 'has'
                }
                if (datas[i].status == '已完成' || datas[i].status == '已归还'){
                  guihuan_list = 'has'
                }
                if (datas[i].status == '待归还' || datas[i].status == '部分待归还'){
                  dai_list = 'hs'
                }
              }
              that.setData({
                shenhe_list: shenhe_list,
                guihuan_list: shenhe_list,
                dai_list: dai_list
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
