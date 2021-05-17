//Page Object
Page({
  data: {

  },
  //options(Object)
  onLoad: function (options) {
    this.position = {
      x: 150,
      y: 150,
      vx: 2,
      vy: 2
    }
    this.x = -100

    const selQuery = wx.createSelectorQuery();
    selQuery.select('#canvas')
      .fields({ size: true, node: true })
      .exec(this.init.bind(this))
  },

  init(res) {
    const canvas = res[0].node;
    const cxt = canvas.getContext('2d');
    cxt.beginPath();
    cxt.arc(100, 100, 50, 0, 1, false);
    cxt.lineWidth = 1;
    cxt.strokeStyle = "green";
    cxt.stroke();//画空心圆
    cxt.closePath();
  },

  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});