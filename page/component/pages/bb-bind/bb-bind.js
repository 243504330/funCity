Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    pub_url:'',
    date:'',
    index:'',
    array: ['我家孩子', '别人家孩子'],
    sex:'',
    notice:'',
    list:'',
    checkId:'',
    scroll_height:'',
    cardId:''
  },
  changeSex:function(opt){
    console.log(opt)
    var sex = opt.currentTarget.id;
    this.setData({
      sex:sex
    })
  },
  check:function(e){
    console.log(e)
    var id = e.currentTarget.id;
    this.setData({
      checkId:id
    })
  },
  bbCreat:function(){
    wx.navigateTo({
      url: '../bb-creat/bb-creat'
    })
  },
  creat:function(){
    wx.navigateTo({
      url: '../bb-creat/bb-creat'
    })
  },
  onShow:function(){
    this.load();
    console.log(this.data.cardId)
  },
  onLoad: function (e) {
    var that = this;
    var type = 'selectTicketList';
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var cardId = e.id;
    console.log(cardId)
    this.setData({
      scroll_height: windowHeight,
      cardId: cardId
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9f9f9',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindCard(){
    var cardId = this.data.cardId;
    var checkId = this.data.checkId;
    var pub_url = this.data.pub_url;
    console.log(checkId);
    if(checkId == ''){
      wx.showToast({
        title: '请先选择宝宝',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    
    wx.showModal({
      title: '激活提示',
      content: '每张卡只允许绑定1位宝宝，绑定后无法修改，是否继续绑定',
      confirmText: '确认绑定',
      cancelText:'再想想',
      success(ress) {
        if (ress.confirm) {
          wx.showLoading();
          wx.getStorage({
            key: 'user_data',
            success(res) {
              var json = JSON.parse(res.data);
              var userinfoid = json.id;
              var shopid = json.shopid;
              wx.request({
                url: pub_url + '/toysburg/myWallet/activateTheCard',
                method: 'GET',
                data: {
                  terminal: 'ios',
                  chrildrenId: checkId,
                  cardId: cardId
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  console.log(res)
                  if (res.data.retCode == '000') {
                    wx.showToast({
                      title: res.data.rtnMsg,
                      icon: 'none',
                      duration: 2000
                    })
                    setTimeout(function(){
                      wx.redirectTo({
                        url: '../card-detai/card-detai?id=' + cardId + '&title=ok'
                      })
                    },1000)
                  } else {
                    wx.showToast({
                      title: res.data.rtnMsg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                },
                fail(error) {
                  wx.showToast({
                    title: '请求错误',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindDateChange(e) {
    var date = e.detail.value

    this.setData({
      date: e.detail.value
    })
  },
  load:function(){
    var that = this;
    var userinfoid = '';
    var shopid = '';
    var pub_url = getApp().globalData.url;
    this.setData({
      pub_url:pub_url
    })
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        userinfoid = json.id;
        shopid = json.shopid;
        wx.request({
          url: pub_url + '/toysburg/userChildren/searchChildren',
          method: 'GET',
          data: {
            terminal: 'ios',
            userId: userinfoid,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            var notice = '';
            var data = res.data.ext;
            if (res.data.retCode == '000') {
              notice = data.firstScore;
              that.setData({
                notice:notice
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
        wx.request({
          url: pub_url + '/toysburg/userChildren/selectUserChildren',
          method: 'GET',
          data: {
            terminal: 'ios',
            userId: userinfoid,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            var notice = '';
            var data = res.data.ext;
            if (res.data.retCode == '000') {
              that.setData({
                list:res.data.data
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
      }
    })
  }
})
