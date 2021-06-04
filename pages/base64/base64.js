var helper = require('../../src/index.js');
var app =  getApp();
// pages/base64/base64.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    areaWith: 750,
    areaHeight: 750,
    imgUrl: '',
    imagewidth: '',
    imageheight: '',
    base64: ''
  },

  uploadImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imgUrl: tempFilePaths[0]
        })
      }
    })
  },
  imageReponseToBox: function (e) {
    var imageSize = {};
    var originalWidth = e.detail.width;//图片原始宽 
    var originalHeight = e.detail.height;//图片原始高 
    var originalScale = originalHeight / originalWidth;//图片高宽比 
    //获取屏幕宽高 
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale = windowHeight / windowWidth;//屏幕高宽比 
        if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比 
          //图片缩放后的宽为屏幕宽 
          imageSize.imageWidth = windowWidth;
          imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
        } else {//图片高宽比大于屏幕高宽比 
          //图片缩放后的高为屏幕高 
          imageSize.imageHeight = windowHeight;
          imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
        }
      }
    })
    return imageSize;
  },
  imageLoad: function (e) {
    var imageSize = this.imageReponseToBox(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  processImage: function () {
    var that = this;
    helper.getBase64Image('myCanvas', this.data.imgUrl, function (data) {
      that.setData({
        base64: data
      });
    });
  },
  previewImage(){
    var that = this;
    wx.previewImage({
      current: that.data.base64,
      urls: [that.data.base64],
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.appRequest('GET','http://blog.csdn.net/',{}).then( (res)=>{
      console.log('success',res);//正确返回结果
      wx.hideLoading();
   } ).catch( (errMsg)=>{
      console.log('err',errMsg);//错误提示信息
      wx.hideLoading();
   } );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 首次进入，利用隐藏的judgeCanvas判断当前导出图像是否颠倒
    helper.checkOrientation('judgeCanvas');
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