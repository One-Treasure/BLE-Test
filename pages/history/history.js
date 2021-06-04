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
    num: [1, 2, 5, 8, 9],
    swiperList: ['/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg', '/icon/1.jpg'],
    activeIndex: 1,//默认放大显示的卡片角标
    cur: 1
  },

  /* 切换卡片事件 */
  swiperChange(e) {
    /* if (e.detail.current >= this.data.swiperList.length - 2) {
      e.detail.current = e.detail.current - this.data.swiperList.length
    } */
    this.setData({
      activeIndex: e.detail.current
    })
  },

  //给点击的日期设置一个背景颜色
  dayClick: function (event) {
    const day = event.detail.year + '.' + event.detail.month + '.' + event.detail.day;
    console.log(day);
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})