// pages/webgl/webgl.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class1: 'z1', //默认正面在上面
    class2: 'z2'
  },

  rotateFn: function(e) {
    let data = this.data;
    if (data.class1 == 'z1' && data.class2 == 'z2') {
     this.run('front', 'back', 'z2', 'z1');
    } else {
     this.run('back', 'front', 'z1', 'z2');
    }
   },
   run: function(a, b, c, d) {
    let that = this;
    that.setData({
     class1: a,
     class2: b,
    })
    setTimeout(function() {
     that.setData({
      class1: c,
      class2: d,
     })
    }, 1000);
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* setTimeout(() => {
      var animation = wx.createAnimation({
        duration: 4000,
        timingFunction: 'ease',
        delay: 1000
      });
      animation.rotateY(180).step()
      this.setData({
        ani: animation.export()
      })
    }, 1000); */
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 100
    });
    var con = 0;
    setInterval(() => {
      // con += 180;
      animation.rotateY(con).step()
      this.setData({
        ani: animation.export()
      })
    }, 1000);
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