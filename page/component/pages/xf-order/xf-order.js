Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    list:'',
    type:'',
    scroll_height:'',
    finished_list:'',
    pickup_list:'',
    currentTab:0
  },
  upper:function(){
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
      id = 'finished'
    }
    this.setData({
      type: id
    })

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
  chose(options) {
    var id = options.currentTarget.id;
    var currentTab = 0;
    if (id == '') {
      currentTab = 0
    }
    if (id == 'pickup') {
      currentTab = 1
    }
    if (id == 'finished') {
      currentTab = 2
    }
    this.setData({
      type: id,
      currentTab: currentTab
    })
    this.load();
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
      pub_url: pub_url
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userid = json.id;
        shopid = json.shopid;
        wx.request({
          url: pub_url + '/toysburg/order/expenditure',
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
              var list = res.data.data;
             
              var pickup = [];
              var finished = [];
              for(var i =0 ; i < list.length; i ++){
                console.log(list[i])
                if(list[i].status == '待取'){
                  pickup.push(list[i])
                }
                if(list[i].status == '已完成'){
                  finished.push(list[i])
                }
              }
              that.setData({
                list: list,
                pickup_list:pickup,
                finished_list:finished
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
