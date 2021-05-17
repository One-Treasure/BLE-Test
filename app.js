// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success: (res)=>{
        let windowHeight = (res.windowHeight * (750 / res.windowWidth))
        let windowWidth = (res.windowWidth * (750 / res.windowWidth))
        wx.setStorageSync('windowHeight', windowHeight);
        wx.setStorageSync('windowWidth', windowWidth);
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
