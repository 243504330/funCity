Page({
  takePhoto() {
    wx.showLoading()
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];
    var that = this;

    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        console.log(res.tempImagePath)
        prevPage.setData({
          imgSrc: res.tempImagePath
        })
        prevPage.checkBtn();
        wx.navigateBack({ delta: 1 })
      }
    })
  },
  close:function(){
    console.log(123)
    wx.navigateBack({ delta: 1 })
  },
  setPwd:function(){
    wx.navigateTo({
      url: '../set-pwd/set-pwd'
    })
  },
  goTicketDetail(event){

  },
  changeType:function(){
    var device = this.data.device;
    if (device == 'back'){
      var type = 'front';
    }else{
      var type = 'back';
    }
    this.setData({
      device:type
    })
  },
  data:{
    pub_url:'',
    scroll_width:'',
    scroll_height:'',
    cameraType:'none',
    device:'back',
    src:''
  },
  out:function(){
    wx.clearStorage();
  },
  setting:function(){
    wx.openSetting({
      success(res) {
        console.log(res.authSetting)
        res.authSetting = {
          "scope.camera": true
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var pub_url = getApp().globalData.url;

    var that = this
    this.setData({
      scroll_height: windowHeight,
      scroll_width: windowWidth,
      pub_url:pub_url
    })
    setTimeout(function(){
      that.setData({
          cameraType:'block'
        })
    },1000)
  }
})
