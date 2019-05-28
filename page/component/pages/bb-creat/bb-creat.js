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
    imgSrc:'',
    nickname:'',
    notice:'',
    xgg:false,
    sub_btn:'sub_def'
  },
  clearName:function(){
    this.setData({
      nickname:''
    })
  },
  changeSex:function(opt){
    console.log(opt)
    var sex = opt.currentTarget.id;
    this.setData({
      sex:sex
    })
    this.checkBtn();
  },
  back:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  onLoad: function (opt) {
    var that = this;
    var type = 'selectTicketList';
    var id = '';
    console.log(opt)
    if(opt.id){
      id = opt.id;
    }else{
      id = '';
    }
    console.log(id)
    this.setData({
      id: id
    })
    
    if(opt.type == 'xgg'){
      this.setData({
        xgg:true
      })
    }
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
  checkBtn:function(){
    var that = this;
    var imageSrc = that.data.imgSrc;
    var date = that.data.date;
    var nickname = that.data.nickname;
    var relation = that.data.index;
    var sex = that.data.sex;

    if(imageSrc == '' || date == '' || nickname == '' || relation == '' || sex == ''){
      this.setData({
        sub_btn:'sub_def'
      })
    }else{
      this.setData({
        sub_btn: 'sub'
      })
    }
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.checkBtn();
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    var date = e.detail.value
    date = date.replace(/-/g, "/")

    this.setData({
      date: date
    })
    this.checkBtn();
  },
  goCamera:function(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          wx.showModal({
            title: '提示',
            content: '尚未打开摄像头权限',
            confirmText:'前往打开',
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
        }else{
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
    console.log(that.data.id)

    var isSub = this.data.sub_btn;
    if (isSub == 'sub_def'){
      return false
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

        console.log(relation);
        if(relation == '0'){
          relation = 'W'
        }else{
          relation = 'B'
        }

        var arr = {
            terminal: 'ios',
            userid: userinfoid,
            sex:sex,
            nickname:  nickname,
            relation:  relation,
            birthday:  date,
            image: imageSrc
        }
        wx.uploadFile({
          url: pub_url + '/toysburg/userChildren/modifyUserChildren',
          filePath: imageSrc,
          name: 'data',
          formData:arr,
          success(res) {
            console.log(res)
            var result = JSON.parse(res.data)
            if (result.retCode == '000') {
              wx.showToast({
                title: result.rtnMsg,
                icon: 'none',
                duration: 2000
              })
              if(that.data.id != ''){
                wx.redirectTo({
                  url: '../bb-bind/bb-bind?id=' + that.data.id
                })
              }else{
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
              }
              
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
