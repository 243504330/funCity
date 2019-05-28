Page({
  onShareAppMessage() {
    return {
      title: 'canvas',
      path: 'page/component/pages/canvas/canvas'
    }
  },
  data:{
    scroll_height: '',
    scroll_width: '',
    phone:'',
    btn:'def_btn',
    user_id:'',
    userinfoid:''
  },
  goticket:function(){
    wx.switchTab({
      url: '../my_wallet/my_wallet'
    })
  },
  sub:function(){
    if (this.data.userinfoid == '') {
      wx.navigateTo({
        url: '../login/login?type=share',
      })
    } else {
      wx.switchTab({
        url: '../my_wallet/my_wallet'
      })
    }
  },
  phone: function (e) {

  },
  onReady() {

  },
  onLaunch(opt){

  },
  onLoad(option){
    console.log(option)
    var phone = option.phone;

    console.log(phone.substring(0,3))
    phone = phone.substring(0, 3) + '****' + phone.substring(7, 11)



    var that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    var userinfoid = '';
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2E1163',
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
        if(!userinfoid){
          userinfoid = '';
        }
        that.setData({
          userinfoid: userinfoid
        })
        console.log(that.data.userinfoid)
      }
    })
    this.setData({
      scroll_height: windowHeight,
      scroll_width: windowWidth,
      phone:phone
    })

  },
  drawBall() {

  },

  onUnload() {
   
  }
})
