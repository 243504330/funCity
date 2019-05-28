Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  upper:function(){
    console.log(123)
    wx.startPullDownRefresh()
  },
  bindOrder:function(event){
    var page = event.detail.current;
    console.log(page)
    var id = '';
    if(page == 0){
      id = 'all'
    }
    if(page == 1){
      id = 'ticket'
    }
    if(page == 2){
      id = 'game'
    }
    if(page == 3){
      id = 'card'
    }

    this.setData({
      type: id
    })

  },
  data:{
    list:'',
    type:'all',
    scroll_height:'',
    card_list:'',
    game_list:'',
    ticket_list:'',
    currentTab:0
  },
  goOrderDetai(event){
    var id = event.currentTarget.id;
    var type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../cw-order-detai/cw-order-detai?id='+id+'&type='+type
    })
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onPullDownRefresh() {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    setTimeout(function(){
      wx.stopPullDownRefresh({
        complete(res) {
          wx.hideToast()
          console.log(res, new Date())
        }
      })
    },1000)
    
  },
  chose(options){
    var id = options.currentTarget.id;
    var currentTab = 0;
    if(id == 'all'){
      currentTab = 0
    }
    if(id == 'ticket'){
      currentTab = 1
    }
    if(id == 'game'){
      currentTab = 2
    }
    if(id == 'card'){
      currentTab = 3
    }
    this.setData({
      type:id,
      currentTab:currentTab
    })
    this.load();
  },
  onLoad: function (options) {
    var that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({
      scroll_height: windowHeight,
      scroll_width: windowWidth
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.load('all');
  },
  load:function(type){
    console.log(type)
    var that = this;
    var userid = '';
    var shopid = '';
    var pub_url = getApp().globalData.url;
    var type = 'all';
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
          url: pub_url + '/toysburg/playfreely/getOrder',
          method: 'GET',
          data: {
            terminal: 'android',
            userid: userid,
            orderType: type,
            pageCurrent:0,
            pageSize:100
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
      
            if (res.data.retCode == '000') {
              var list = '';
              if(type == 'all'){
                list = res.data.ext.list;
              }
              var ticket_list =[];
              var game_list = [];
              var card_list = [];
              for(var i = 0 ; i < list.length ; i ++){
                
                if (list[i].item_type == 'ticket'){
                  ticket_list.push(list[i])
                }
                if (list[i].item_type == 'game'){
                  game_list.push(list[i])
                }
                if (list[i].item_type == 'card'){
                  card_list.push(list[i])
                }
                
              }

              console.log(game_list)

              that.setData({
                list:list,
                card_list:card_list,
                game_list:game_list,
                ticket_list: ticket_list
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
