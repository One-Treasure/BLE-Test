import Dialog from '@vant/weapp/dialog/dialog';
var app = getApp();

// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    capture: ['camera'],
    avatarUrl: '',
    nickName: ''
  },

  /* 获取用户信息（头像、昵称等） */
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        // res.userInfo.openId = wx.getStorageSync('openId');
        const data = res.userInfo;
        app.appRequest('POST', 'setUserInfo', { data }).then(res => {
          console.log(res);
        })
        this.setData({
          userInfo: res.userInfo,
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      }
    })
  },

  /* 跳转至 */
  toNewView(e) {
    if (!wx.getStorageSync('avatarUrl')) {
      Dialog.alert({
        context: this,//代表的当前页面
        selector: "#van-dialog",//选择器
        title: '提示',
        message: '不登录无法进行更多操作哦',
        theme: 'round-button',
      })
    } else {
      const { url } = e.currentTarget.dataset;
      wx.navigateTo({
        url
      });
    }
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
    let avatarUrl = '';
    let nickName = '';
    if (wx.getStorageSync('avatarUrl')) {
      avatarUrl = wx.getStorageSync('avatarUrl');
    }
    if (wx.getStorageSync('nickName')) {
      nickName = wx.getStorageSync('nickName');
    }
    this.setData({
      avatarUrl,
      nickName
    })
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