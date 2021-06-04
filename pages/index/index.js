import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
import { base64src } from '../../utils/base64src.js'
var helper = require('../../src/index.js');
var app = getApp();

//Page Object
Page({
  data: {
    fileList: [], //用户拍照数据
    capture: ['camera'], //图片或视频选取模式，只有camera可直接调用摄像头
    imgurl: '/icon/1.jpg', //用户本次拍照照片url
    nickName: '',
    avatarUrl: '',
    hidden_wrapper: true,
    tempdata: { icon: '/icon/temp_m.png', bgcolor: 'linear-gradient(180deg, #FFDC9F 0%, #F9BE56 100%);' },
    humdata: { icon: '/icon/humidity_m.png' },
    pm25Cdata: { icon: '/icon/pm2.5_m.png' },
    overflow: 'overflow: hidden;'
  },

  /* 获取用户信息（头像、昵称等） */
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const userinfo = res.userInfo;
        app.appRequest('POST', 'setUserInfo', userinfo).then(res => {
          const data = res.data.data;
          wx.setStorage({
            key: 'avatarUrl',
            data: data.avatar
          });
          wx.setStorage({
            key: 'nickName',
            data: data.nickname
          });
          /* wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 1500,
            mask: false
          }); */
          Notify({ type: 'success', message: res.data.message });
          this.setData({
            avatarUrl: data.avatar,
            nickName: data.nickname
          })
        }, err => {
          /* wx.showToast({
            title: '绑定失败，请重试',
            duration: 1500,
            mask: false
          }); */
          Notify({ type: 'error', message: '绑定失败，请重试' });
        })
      },
      fail: (res) => {
        Dialog.alert({
          context: this,//代表的当前页面
          selector: "#van-dialog",//选择器
          title: '提示',
          message: '不绑定无法进行更多操作哦',
          theme: 'round-button',
        })
      }
    })
  },

  /* 获取用户当前地址的坐标信息 */
  getLocation() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let weather = {};
        weather.latitude = res.latitude;
        weather.longitude = res.longitude;
        wx.setStorageSync('weather', weather);
        if (wx.getStorageSync('weather') !== weather) {
          that.getWeather(weather);
        }
      },
      fail(res) {
        if (res.errMsg === 'getLocation:fail system permission denied') {
          Dialog.alert({
            context: this,//代表的当前页面
            selector: "#van-dialog",//选择器
            title: '提示',
            message: '请打开您手机的GPS以便于查看天气情况哦',
            theme: 'round-button',
          })
        } else {
          Dialog.alert({
            context: this,//代表的当前页面
            selector: "#van-dialog",//选择器
            title: '提示',
            message: '请打开小程序的定位权限以便于查看天气情况哦',
            theme: 'round-button',
          }).then(() => {
            // on close
            wx.openSetting({
              success: (res) => {
                if (!res.authSetting['scope.userLocation']) {
                  Dialog.alert({
                    context: this,//代表的当前页面
                    selector: "#van-dialog",//选择器
                    title: '温馨提示',
                    message: '不打开定位权限无法查看天气情况哦',
                    theme: 'round-button',
                  })
                }
              },
              fail: () => { },
              complete: () => { }
            });
          });
        }
      }
    })
  },

  /* 跳转至拍照页面 */
  toCamera(){
    wx.navigateTo({
      url: '/pages/camera/camera'
    });
  },

  /* 点击连接设备事件 */
  clickLink() {
    this.setData({
      show: true
    })
  },

  /* previewImage() {
    wx.previewImage({
      current: this.data.imgurl,
      urls: [this.data.imgurl]
    });
  }, */

  /* 照片上传，测试使用 */
  afterRead(event) {
    const { file } = event;
    console.log(event);
    var that = this;
    app.slideupshow(this, 'slide_up1', 0, 1)
    this.setData({
      overflow: 'overflow: hidden;'
    })
    const base64 = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(file, "base64");
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    var reqTask = wx.request({
      url: 'http://192.168.0.107:8083/api/analyze',
      data: { file: base64 },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        const { data } = res.data;
        that.setData({
          imgurl: data.path,
          hidden_wrapper: false,
          top: -800
        })
        setTimeout(() => {
          this.setData({
            hidden_wrapper: true,
            overflow: ''
          })
          app.slideupshow(this, 'slide_up1', -800, 1)
        }, 5000)
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
    console.log(options);
    this.getLocation(wx.getStorageSync('weather'));
    this.afterRead(options);
    if (app.globalData.hashLogin) { // 登录已完成
      console.log('app.globalData.hasLogin1', app.globalData);
      /* app.appRequest('GET', 'analyze', {}).then((res) => {
        console.log('success', res);//正确返回结果
      }).catch((errMsg) => {
        console.log('err', errMsg);//错误提示信息
      }); */
    } else {
      console.log('app.globalData.hasLogin2', app.globalData);
      /* app.watch((value) => {
        app.appRequest('POST', 'analyze', {}).then((res) => {
          console.log('success', res);//正确返回结果
        }).catch((errMsg) => {
          console.log('err', errMsg);//错误提示信息
        });
      }) */
    }
  },
  onReady: function () {
    // 首次进入，利用隐藏的judgeCanvas判断当前导出图像是否颠倒
    helper.checkOrientation('judgeCanvas');
    this.selectComponent('#tabs').resize();
  },
  onShow: function () {
    console.log('app.globalData.hasLogin3', app.globalData);
    const that = this;
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
    wx.getSetting({
      success: (res) => {
        // console.log(res.authSetting['scope.userLocation']);
        if (res.authSetting['scope.userLocation']) {
          // this.getLocation();
          if (!wx.getStorageSync('weather')) {
            this.setData({
              local_power: false
            })
          }
        } else {
          this.setData({
            local_power: false
          })
        }
      },
      fail: () => { },
      complete: () => { }
    });
  },

  /* 获取天气状况的方法 */
  getWeather(weather) {
    var that = this;
    app.appRequest('POST', 'getWeather', weather).then((res) => {
      console.log(res);
      const { data } = res.data;
      const { temp, uvi, humidity } = data.condition;
      const { pm25C } = data.aqi;
      Notify({ type: 'success', message: res.data.message });
      let { tempdata, humdata, pm25Cdata } = that.data;
      switch (true) {
        case temp > 25:
          tempdata.icon = '/icon/temp_h.png';
          tempdata.bgcolor = 'linear-gradient(180deg, #FFD29F 0%, #F99D56 100%);';
          break;
        case temp > 15 && temp <= 25:
          tempdata.icon = '/icon/temp_m.png';
          tempdata.bgcolor = 'linear-gradient(180deg, #FFDC9F 0%, #F9BE56 100%);';
          break;
        default:
          tempdata.icon = '/icon/temp_l.png';
          tempdata.bgcolor = 'linear-gradient(180deg, #B8E3FF 0%, #56B2F9 100%);';
          break;
      }
      switch (true) {
        case humidity > 60:
          humdata.icon = '/icon/humidity_h.png';
          break;
        case humidity > 40 && humidity <= 60:
          humdata.icon = '/icon/humidity_m.png';
          break;
        default:
          humdata.icon = '/icon/humidity_l.png';
          break;
      }
      switch (true) {
        case pm25C < 35:
          pm25Cdata.icon = '/icon/pm2.5_l.png';
          break;
        case pm25C >= 35 && pm25C < 75:
          pm25Cdata.icon = '/icon/pm2.5_m.png';
          break;
        default:
          pm25Cdata.icon = '/icon/pm2.5_h.png';
          break;
      }
      that.setData({
        local_power: true,
        tempdata,
        temp, // 温度 单位摄氏度
        uvi, // 紫外线强度
        humidity, // 湿度 单位%
        pm25C // pm2.5浓度 单位μg/m³（微克每立方米）
      })
    })
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