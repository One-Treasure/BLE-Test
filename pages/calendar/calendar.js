Page({
  data: {
    swiperList: ['/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg'],
    activeIndex: 1,
    cur: 1
  },
  onLoad: function () {
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    var ani1 = animation.opacity(1).scale(1.2, 1.2).step();
    this.setData({
      ani1, animation
    })
  },
  swiperChange(e) {
    var ani1 = this.data.animation.opacity(1).scale(1, 1).step();
    /* if (e.detail.current >= this.data.swiperList.length - 2) {
      e.detail.current = e.detail.current - this.data.swiperList.length
    } */
    this.setData({
      activeIndex: e.detail.current,
      ani1
    })
  }
})