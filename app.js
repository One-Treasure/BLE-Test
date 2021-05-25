// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({
      success: (res) => {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth))
        let windowWidth = (res.windowWidth * (750 / res.windowWidth))
        wx.setStorageSync('windowHeight', windowHeight);
        wx.setStorageSync('windowWidth', windowWidth);
      },
      fail: () => { },
      complete: () => { }
    });

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  /** 
    * 自定义get, post函数，返回Promise
    * +-------------------
    * @param {String}      url 接口网址
    * @param {arrayObject} data 要传的数组对象 例如: {name: 'zhangsan', age: 32}
    * +-------------------
    * @return {Promise}    promise 返回promise供后续操作
    */
  appRequest: function (method, url, data) {
    var promise = new Promise((resolve, reject) => {
      //init
      var that = this;
      //网络请求
      wx.request({
        url: url,
        data: data,
        method: method,
        header: {
          'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        },
        dataType: 'json',
        success: function (res) {//服务器返回数据
          if (res.data.status == 1) {//res.data 为 后台返回数据，格式为{"data":{...}, "info":"成功", "status":1}, 后台规定：如果status为1,既是正确结果。可以根据自己业务逻辑来设定判断条件
            resolve(res.data.data);
          } else {//返回错误提示信息
            reject(res.data.info);
          }
        },
        error: function (e) {
          reject('网络出错');
        }
      })
    });
    return promise;
  },
  globalData: {
    userInfo: null
  }
})
