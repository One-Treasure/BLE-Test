// app.js
App({
  //渐入，渐出实现 
  show : function(that,param,opacity){
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    //var animation = this.animation
    animation.opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //滑动渐入渐出
  slideupshow:function(that,param,px,opacity){
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    console.log(json);
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  //向右滑动渐入渐出
  sliderightshow: function (that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateX(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },
  name: "测试账号",
  siteUrl: "http://192.168.0.107:8083/api/wechat/", // 必填: api地址，结尾要带/
  act: "",
  groupIV: "",
  groupData: "",
  globalData: {
    userInfo: null,
    hashLogin: false
  },
  onLaunch() {
    this.appUpdate();
    // 展示本地存储能力
    /* const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs) */
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

    if (!wx.getStorageSync('session')) {
      // 登录
      this.login().then(() => {
        // 把hasLogin设置为 true
        this.globalData.hashLogin = true;
      })
        // 把hasLogin设置为 false
        .catch(() => {
          this.globalData.hashLogin = false;
        });
    }
  },

  // 监听hasLogin属性
  watch: function (fn) {
    var obj = this.globalData
    Object.defineProperty(obj, 'hashLogin', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._hashLogin = value;
        fn(value);
      },
      get: function () {
        return this._hashLogin
      }
    })
  },

  /**
   * 检查小程序是否需要更新
   */
  appUpdate: function () {
    var updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(() => { });
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '小程序更新',
        content: '您的小程序有新版本啦，点击确定立即更新吧！',
        success: (result) => {
          if (result.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
      updateManager.onUpdateFailed((result) => {
        wx.showToast({
          title: '更新失败了，可能是网络不太好',
          icon: 'error',
          duration: 1500
        });
      });
    });
  },

  /**
   * 
   * @param {*} method 
   * @param {*} url 
   * @param {*} data 
   * @returns 
   */
  login() {
    var promise = new Promise((resolve, reject) => {
      wx.login({
        timeout: 10000,
        success: (res) => {
          const { code } = res
          wx.showLoading({
            title: '加载中...',
            mask: true,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });
          wx.request({
            url: `${this.siteUrl}getSessionId`,
            data: { code },
            header: { 'content-type': 'application/json' },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            timeout: 10000,
            success: (res) => {
              if (res.statusCode === 200) {
                wx.hideLoading();
                const data = res.data.data;
                console.log(data);
                wx.setStorageSync('session', data.sessionid);
                if (data.userInfo !== null) {
                  wx.setStorageSync('avatarUrl', data.userInfo.avatar);
                  wx.setStorageSync('nickName', data.userInfo.nickname);
                }
                resolve();
              } else {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '出了点问题，请重试一下吧',
                  showCancel: false
                });
                reject();
              }
            },
            fail: () => { },
            complete: () => { }
          });
        },
        fail: () => { },
        complete: () => { }
      });
    });
    return promise;
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

    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var promise = new Promise((resolve, reject) => {
      // 判断session是否过期，如果过期则重新请求登录接口
      wx.checkSession({
        success: (result) => {
          //网络请求
          wx.request({
            url: this.siteUrl + url,
            data: data,
            method: method,
            header: {
              // 'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
            },
            dataType: 'json',
            success: function (res) {//服务器返回数据
              if (res.statusCode === 200) {//res.data 为 后台返回数据，格式为{"data":{...}, "info":"成功", "status":1}, 后台规定：如果status为1,既是正确结果。可以根据自己业务逻辑来设定判断条件
                resolve(res);
              } else {//返回错误提示信息
                reject(res);
              }
            },
            error: function (e) {
              reject('网络出错');
            },
            complete: () => {
              wx.hideLoading();
            }
          })
        },
        fail: () => {
          this.login();
        },
        complete: () => { }
      });
    });
    return promise;
  }
})
