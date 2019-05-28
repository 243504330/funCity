Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  checkBtn(){
    var nickname = this.data.nickname;
    console.log(nickname)
    var isSub = '';
    if(nickname == ''){
      isSub = 'sub_def';
    }else{
      isSub = 'sub'
    }
    this.setData({
      isSub:isSub
    })
  },
  del:function(){
    var id = this.data.kidId;
    var pub_url = this.data.pub_url;
    var that = this;
    console.log(id)
    wx.showModal({
      title: '温馨提示',
      content: '确定删除宝宝档案？',
      confirmText: '确认',
      cancelText:'再想想',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: pub_url + '/toysburg/userChildren/deleteUserChildren',
            method: 'GET',
            data: {
              id:id,
              terminal:'ios'
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data.retCode == '000') {
                wx.showToast({
                  title: res.data.rtnMsg,
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
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
        } else if (res.cancel) {

        }
      }
    })
  },
  data:{
    pub_url:'',
    date:'',
    index:'',
    array: ['我家熊孩子', '别人家熊孩子'],
    sex:'B',
    imgSrc:'',
    qsImg:'',
    nickname:'',
    notice:'',
    xhz:'',
    kidId:'',
    edAll:false,
    type:'',
    disabled:false,
    isSub:'sub_def'
  },
  clearName:function(){
    this.setData({
      nickname:''
    })
    this.checkBtn();
  },
  changeSex:function(opt){
    console.log(opt)
    var sex = opt.currentTarget.id;
    this.setData({
      sex:sex
    })
  },
  onLoad: function (e) {
    var that = this;
    var type = 'selectTicketList';

    var pub_url = getApp().globalData.url;

    console.log(e);

    if(e.type == 'Y'){
      var disabled = true
    }else{
      var disabled = false
    }

    console.log(e)

    if (e.relation == 'B'){
      var xhz = '别人家熊孩子';
    }else{
      var xhz = '我家熊孩子';
    }

    that.setData({
      date:e.birthday,
      nickname:e.nickname,
      imgSrc: pub_url + e.image,
      qsImg:pub_url + e.image,
      sex:e.sex,
      xhz:xhz,
      kidId:e.id,
      type:e.type,
      disabled: disabled
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2E1163',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.load();
  },
  name:function(e){
    var nickname = e.detail.value;
    this.setData({
      nickname:nickname
    })
    this.checkBtn();
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
    date = date.replace(/-/g, "/")

    this.setData({
      date: date
    })
  },
  goCamera:function(){

    if(this.data.type == 'Y'){
      return false
    }

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          wx.showModal({
            title: '提示',
            content: '尚未打开摄像头权限',
            confirmText: '前往打开',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                  }
                })
              } else if (res.cancel) {


              }
            }
          })
        } else {
          wx.navigateTo({
            url: '../bb-camera/bb-camera'
          })
        }
      }
    })
  },
  sub:function(){
    var pub_url = this.data.pub_url;
    var that = this;
    var sub = this.data.isSub;
    if(sub == 'sub_def'){
      return false
    }

    var imageSrc = that.data.imgSrc;
    var qsImg = that.data.qsImg;
    var type = '';

    if(imageSrc == qsImg){
      type =  'nameEdit';
    }


    wx.showLoading()
    wx.getStorage({
      key: 'user_data',
      success(res) {
        var json = JSON.parse(res.data);
        var userinfoid = json.id;
        var shopid = json.shopid;
        var imageSrc = that.data.imgSrc;
        var date = that.data.date;
        var nickname = that.data.nickname;
        var relation = that.data.index;
        var sex = that.data.sex;
        var kidId = that.data.kidId;

        if (type == 'nameEdit'){
          var arr = {
            terminal: 'ios',
            userid: userinfoid,
            id: kidId,
            nickname: nickname,
            act: 'nickname'
          }

          wx.request({
            url: pub_url + '/toysburg/userChildren/modifyUserChildren',
            method: 'GET',
            data: arr,
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
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
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
        }else{
          var arr = {
            terminal: 'android',
            userid: userinfoid,
            id: kidId,
            image: imageSrc,
            nickname: nickname,
            act: 'image,nickname'
          }
          wx.uploadFile({
            url: pub_url + '/toysburg/userChildren/modifyUserChildren',
            filePath: imageSrc,
            name: 'data',
            formData: arr,
            success(res) {
              console.log(res)
              var result = JSON.parse(res.data)
              if (result.retCode == '000') {
                wx.showToast({
                  title: result.rtnMsg,
                  icon: 'none',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
              } else {
                wx.showToast({
                  title: result.rtnMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail(error) {
              console.log(error)
              wx.showToast({
                title: '请求超时',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
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
                notice: notice
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
