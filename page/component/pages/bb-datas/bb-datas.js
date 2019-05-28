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
    array: ['我家熊孩子', '别人家熊孩子'],
    sex:'',
    notice:'',
    list:''
  },
  goDetai:function(event){
    console.log(event)
    var id = event.currentTarget.id;
    var sex = event.currentTarget.dataset.sex;
    var nickname = event.currentTarget.dataset.nickname;
    var relation = event.currentTarget.dataset.relation;
    var birthday = event.currentTarget.dataset.birthday;
    var image = event.currentTarget.dataset.image;
    var type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../bb-edit/bb-edit?id='+id+'&sex='+sex+'&nickname='+nickname+'&relation='+relation+'&birthday='+birthday+'&image='+image + '&type=' + type
    })
  },
  changeSex:function(opt){
    console.log(opt)
    var sex = opt.currentTarget.id;
    this.setData({
      sex:sex
    })
  },
  creat:function(){
    wx.navigateTo({
      url: '../bb-creat/bb-creat'
    })
  },
  onShow:function(){
    this.load();
  },
  onLoad: function () {
    var that = this;
    var type = 'selectTicketList';
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
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
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

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
