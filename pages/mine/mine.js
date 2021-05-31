// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    capture: ['camera']
  },

  /* 跳转至 */
  toNewView(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    });
  },

  /* 照片上传，测试使用 */
  afterRead(event) {
    const { file } = event.detail;
    const base64 = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(file.url, "base64");
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    var reqTask = wx.request({
      url: 'http://192.168.0.107:8083/api/analyze',
      data: { file: base64 },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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