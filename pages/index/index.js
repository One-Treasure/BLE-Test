//Page Object
Page({
  data: {
    fileList: [], //用户拍照数据
    capture: ['camera'], //图片或视频选取模式，只有camera可直接调用摄像头
    imgurl: '/icon/1.jpg' //用户本次拍照照片url
  },

  /* 点击连接设备事件 */
  clickLink() {
    this.setData({
      show: true
    })
  },

  /* 照片上传，测试使用 */
  afterRead(event) {
    const { file } = event.detail;
    const base64 = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(file.url, "base64");
    this.setData({
      imgurl: base64
    })
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    var reqTask = wx.request({
      url: 'http://192.168.0.107:8083/api/analyze',
      data: { file: base64 },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        this.setData({
          imgurl: base64
        })
      },
      fail: () => { },
      complete: () => { }
    });
  },

  /* 点击遮罩层 */
  onClickHide() {
    this.setData({
      show: false
    })
  },

  //options(Object)
  onLoad: function (options) {

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