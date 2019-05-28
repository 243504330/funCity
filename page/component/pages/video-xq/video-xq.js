Page({
  onShow:function(){
    
  },
  data:{
    list:[],
    pub_url:''
  },
  onLoad: function (options) {
    var that = this;
    var pub_url = getApp().globalData.url;
    var imgs = options.imgs;
    var list = JSON.parse(imgs)
    this.setData({
      pub_url:pub_url,
      list:list
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  }
})
