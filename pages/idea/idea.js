import Notify from '@vant/weapp/notify/notify';
var app = getApp();

// pages/idea/idea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  formSubmit(e) {
    const data = e.detail.value;
    console.log(data);
    if (data.content === "") {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (data.contract === "") {
      wx.showToast({
        title: '联系方式不能为空',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    app.appRequest('POST', 'suggest', data).then(res => {
      if(res.statusCode===200){
        console.log(res);
        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 1500,
          success: (result)=>{
            wx.navigateBack({
              delta: 1
            });
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    })
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