// pages/web/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    devicePosition: 'back',
    authCamera: false,//用户是否运行授权拍照
    windowHeight: wx.getStorageSync('windowHeight'),
    windowWidth: wx.getStorageSync('windowWidth')
  },

  onLoad: function () {
    const selQuery = wx.createSelectorQuery();
    selQuery.select('#canvas')
      .fields({ size: true, node: true })
      .exec(this.init.bind(this))
  },

  init(res) {
    console.log(res);
    const selQuery = wx.createSelectorQuery();
    selQuery.select('#canvas')
      .fields({ size: true, node: true })
      .exec(res => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio

        //新接口需显示设置画布宽高；
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr);
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        let copyRightItems = 0;
        this.countTime = setInterval(function () {
          if (copyRightItems <= 40) {
            copyRightItems++;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(x / 2, y / 2, 180, 1.5 * Math.PI, 2 * Math.PI * (copyRightItems / 100) - Math.PI * 1 / 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#fff";
            ctx.stroke();//画空心圆
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(x / 2, y / 2, 150, Math.PI, (copyRightItems / 100));
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#fff";
            ctx.stroke();//画空心圆
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(x / 2, y / 2, 130, Math.PI * 1 / 2, (copyRightItems / 100), true);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#fff";
            ctx.stroke();//画空心圆
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(x / 2, y / 2, 180, Math.PI * 1 / 2, Math.PI * (copyRightItems / 100) + Math.PI);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#fff";
            ctx.stroke();//画空心圆
            ctx.closePath();
          } else {
            clearInterval(this.countTime);
          }
        }, 100)
      })
  },

  handleCameraError: function () {
    wx.showToast({
      title: '用户拒绝使用摄像头',
      icon: 'none'
    })
  },
  reverseCamera: function () {
    this.setData({
      devicePosition: "back" === this.data.devicePosition ? "front" : "back"
    });
  },
  takePhoto: function () {
    var cameraContext = wx.createCameraContext();
    //拍摄照片
    new Promise((resolve) => {
      cameraContext.takePhoto({
        quality: 'high',//拍摄质量(high:高质量 normal:普通质量 low:高质量)
        success: (res) => {
          //拍摄成功
          //照片文件的临时文件
          var file = res.tempImagePath;
          resolve(
            this.setData({
              file
            })
          )
        },
        fail: (res) => {
          //拍摄失败
        },
      })
    }).then(() => {
      setTimeout(() => {
        var animation = wx.createAnimation({
          duration: 4000,
          timingFunction: 'ease',
          delay: 1000
        });
        animation.scale(0.8).step()
        this.setData({
          ani: animation.export()
        })
      }, 500);
    })
  },

  // 关闭相机页面
  back() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.camera"]) {
          this.setData({
            authCamera: true,
          })
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              console.log('授权成功')
            }, fail() {
              wx.showModal({
                title: '提示',
                content: '尚未进行授权，部分功能将无法使用',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.openSetting({      //这里的方法是调到一个添加权限的页面，可以自己尝试
                      success: (res) => {
                        if (!res.authSetting['scope.camera']) {
                          wx.authorize({
                            scope: 'scope.camera',
                            success() {
                              console.log('授权成功')
                            }, fail() {
                              console.log('用户点击取消')
                            }
                          })
                        }
                      },
                      fail: function () {
                        console.log("授权设置录音失败");
                      }
                    })

                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      }
    });
  },

  onReady: function () {

  },

  start: function () {

  }

})