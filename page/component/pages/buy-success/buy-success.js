Page({
  goLiuShui(){
    wx.navigateTo({
      url: '../score-ls/score-ls'
    })
  },
  data:{
    list:'',
    name:'',
    btn:'',
    url:'',
    title:'',
    type:'',
    sing:'',
    back:false,
    ptBtn:true,
    isSer:'',
    id:''
  },
  goOrderDetai(event){

  },
  getBack:function(){
    wx.switchTab({
      url: '../my_wallet/my_wallet'
    })
  },
  goOther(){
    var url = this.data.url;
    var type = this.data.type;
    var sing = this.data.sing;
    var isSer = this.data.isSer;
    if (type == 'jdcz' || sing == 'measured'){
      wx.switchTab({
        url: '../my_wallet/my_wallet'
      })
      return false
    }
    if(this.data.btn == '继续扫码投币'){
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          var urlArr = res.result;
          var urlFlag = (urlArr.indexOf("PlayId") != -1);
          if (urlFlag == false) {
            wx.showToast({
              title: '不是有效的二维码',
              icon: 'none',
              duration: 2000
            })
            return false
          }
          var arrX = urlArr.split('?');
          function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = arrX[1].substr().match(reg);
            if (r != null) return unescape(r[2]);
            return null;
          }
          var idNo = getQueryString('PlayId');
          if (!idNo) {
            wx.showToast({
              title: '不是有效的二维码',
              icon: 'none',
              duration: 2000
            })
            return false
          }

          wx.redirectTo({
            url: '../game-tou/game-tou?idNo=' + idNo
          })
        }
      })
       return false 
    }
    if(isSer == 'search'){
      var pub_url = getApp().globalData.url;
      var that = this;
      wx.getStorage({
        key: 'user_data',
        success(res) {
          var json = JSON.parse(res.data);
          var userinfoid = json.id;
          var shopid = json.shopid;
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
              if (res.data.retCode == '000') {
                if(res.data.data == ''){
                  wx.showModal({
                    title: '提示',
                    content: '激活卡需绑定宝宝档案，是否新建宝宝档案？',
                    confirmText:'新建档案',
                    cancelText:'再想想',
                    success(res) {
                      if (res.confirm) {
                        var id = that.data.id;
                        wx.redirectTo({
                          url: '../bb-creat/bb-creat?id='+id
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }else{
                  wx.redirectTo({
                    url: url
                  })
                }
              } else {
                wx.redirectTo({
                  url: url
                })
              }
            },
            fail(error) {
              console.log(error)
            }
          })
        }
      })
    }else{
      wx.redirectTo({
        url: url
      })
    }
  },
  goCoinSend(){
    wx.navigateTo({
      url: '../coinsend/coinsend'
    })
  },
  onLoad: function (options) {
    var that = this;
    var type = options.type;
    var sing = options.sing;
    var back = false;
    var ptBtn = true;
    this.setData({
      type: type,
      sing:sing
    })
    var name = '';
    var btn = '';
    var url = '';
    var title = '支付成功';
    if(type == 'ticket'){
      title = '购票成功';
      name = '请到钱包查看您的的票'
      btn = '查看我的票'
      url = '../ticket/ticket'
    }else if(type == 'game'){
      title = '购币成功';
      name = '您所购买的币请到钱包查看'
      btn = '立即使用'
      url = '../gamecoin/gamecoin'
    }else if(type == 'wjbuy'){
      name = '请到我的订单查看详情'
      btn = '订单列表'
      url = '../xf-order/xf-order'
    }else if (type == 'wjrent') {
      name = '请到我的订单查看详情'
      btn = '订单列表'
      url = '../zp-order/zp-order'
    }else if(type == 'cy'){
      name = '请到我的订单查看详情'
      btn = '订单列表'
      url = '../xf-order/xf-order'
    }else if(type == 'jdcz'){
      title = '充值成功'
      name = '请到钱包查看余额'
      btn = '返回钱包'
      back = false;
      ptBtn = true;
      url = '../my_wallet/my_wallet'
    }else if (type == 'zhushu') {
      title = '租书成功'
      name = '请看完后尽快归还'
      btn = '订单列表'
      url = '../zp-order/zp-order'
    } else if (type == 'toubi') {
      back = true;
      ptBtn = true;
      title = '投币成功'
      name = '请保管好个人身边财务'
      btn = '继续扫码投币'
      url = '../gamecoin/gamecoin'
    }else{

      if(sing == 'measured'){
        back = true;
        ptBtn = false;
        name = ''
        btn = '返回钱包'
        var id = options.id
        this.setData({
          id: id
        })
        url = '../bb-bind/bb-bind?id=' + id
      }else{
        back = true;
        ptBtn = true;
        name = '请填写信息激活您的卡'
        btn = '绑定激活卡'
        var id = options.id
        this.setData({
          id: id
        })
        url = '../bb-bind/bb-bind?id=' + id
        var isSer = 'search'
      }


    }
    this.setData({
      name:name,
      btn:btn,
      url: url,
      title:title,
      back: back,
      ptBtn: ptBtn,
      isSer:isSer
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

  }
})
