Page({
  onShareAppMessage() {
    return {
      title: 'movable-view',
      path: 'page/component/pages/movable-view/movable-view'
    }
  },

  data: {
    x: 0,
    y: 0,
    scale: 2,
    scroll_height:0
  },

  tap() {
    this.setData({
      x: 30,
      y: 30
    })
  },

  tap2() {
    this.setData({
      scale: 3
    })
  },

  onChange(e) {
    console.log(e.detail)
  },

  onScale(e) {
    console.log(e.detail)
  },

  onLoad: function (options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({
      scroll_height: windowHeight,
      scroll_with:windowWidth
    })
  }
})
