// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#FF75A0' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#FF75A0' }
    ],
    num: [1, 2, 5, 8, 9]
  },

  //给点击的日期设置一个背景颜色
  dayClick: function (event) {
    let clickDay = event.detail.day;
    let changeBgColor = `dayStyle[0].color`;
    let changeBg = `dayStyle[0].background`;
    let changeDay = `dayStyle[1].day`;
    let changeEndBg = `dayStyle[1].background`;

    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "rgba(255,255,255,0)",
      [changeBgColor]: "black",
      [changeEndBg]: "#FF75A0"
    })
  },

  hadleDragging(e) {
    var animation1 = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0
    })
    if (e.detail.scrollLeft >= 50 && e.detail.scrollLeft <= 120) {
      animation1.opacity(1).scale(1.2, 1.2).step();
      this.setData({
        animation1
      })
    } else {
      animation1.opacity(1).scale(0.5, 0.5).step();
      this.setData({
        animation1
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* this.setData({
      index: 50
    }) */

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    /* this.setData({
      id: 'i1'
    })
    var animation1 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    animation1.opacity(1).scale(1.2, 1.2).step();
    this.setData({
      animation1
    }) */
    wx.createSelectorQuery()
      .select('#scrollview')
      .node()
      .exec((res) => {
        const scrollView = res[0].node;
        scrollView.scrollTo({
          left: 120,
          animated: true,
          duration: 500
        })
        console.log(res);
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})