import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
import { base64src } from '../../utils/base64src.js'
const util = require('../../utils/util.js')
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
    pm25cdata: { icon: '/icon/pm2.5_m.png' },
    overflow: 'overflow: hidden;',
    bool: true,
    leadshow: true,
    bluetooth: '',
    leadTitle: '打开手机蓝牙',
    leadTips: '长按蜜镜开关开启配对模式',
    ssid: '',
    pass: '',
    logs: [],
    deviceArray: [],
    currDeviceID: '请选择...'
  },

  /* 获取用户信息（头像、昵称等） */
  getUserInfo() {
    const that = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const userinfo = res.userInfo;
        app.appRequest('POST', 'wechat/setUserInfo', userinfo).then(res => {
          const data = res.data.data;
          wx.setStorage({
            key: 'avatarUrl',
            data: data.avatar
          });
          wx.setStorage({
            key: 'nickName',
            data: data.nickname
          });
          Notify({ type: 'success', message: res.data.message });
          this.setData({
            avatarUrl: data.avatar,
            nickName: data.nickname
          })
          that.getCalendarData(dateFormat(new Date()));
        }, err => {
          Dialog.alert({
            context: this,//代表的当前页面
            selector: "#van-dialog",//选择器
            title: '温馨提示',
            message: '出现了点错误，请稍后重试吧',
            theme: 'round-button',
          })
        }).catch(error => {
          Dialog.alert({
            context: this,//代表的当前页面
            selector: "#van-dialog",//选择器
            title: '温馨提示',
            message: '出现了点错误，请稍后重试吧',
            theme: 'round-button',
          })
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
  toCamera() {
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
    console.log(event);
    const file = event;
    if (!file) {
      return;
    }
    var that = this;
    app.slideupshow(this, 'slide_up1', 0, 0)
    this.setData({
      overflow: 'overflow: hidden;'
    })
    const base64 = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(file, "base64");
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    var reqTask = wx.request({
      url: 'http://192.168.0.2:8083/api/analyze',
      data: { file: base64 },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log('afterRead', res.data.data);
        const { data } = res.data;
        if (res.statusCode === 200) {
          that.setData({
            imgurl: data.path,
            hidden_wrapper: false,
          })
          setTimeout(() => {
            this.setData({
              hidden_wrapper: true,
              overflow: '',
              library: data.library
            })
            app.slideupshow(this, 'slide_up1', -80, 1)
          }, 5000)
        } else {
          Dialog.alert({
            context: this,//代表的当前页面
            selector: "#van-dialog",//选择器
            title: '温馨提示',
            message: res.data.errors,
            theme: 'round-button',
          })
        }
      },
      fail: (e) => {
        Dialog.alert({
          context: this,//代表的当前页面
          selector: "#van-dialog",//选择器
          title: '温馨提示',
          message: '网络错误',
          theme: 'round-button',
        })
      },
      complete: () => { }
    });
  },

  /* 点击遮罩层 */
  onClickHide() {
    this.setData({
      show: false
    })
  },

  /* 点击隐藏或显示皮肤瑕疵标签 */
  bindAnim() {
    let { bool } = this.data;
    if (bool) {
      app.slideupshow(this, 'slide_up1', 0, 0)
    } else {
      app.slideupshow(this, 'slide_up1', -80, 1)
    }
    this.setData({
      bool: !bool
    })
  },

  //options(Object)
  onLoad: function (options) {
    if (app.globalData.hashLogin) { // 登录已完成
      this.getLocation(wx.getStorageSync('weather'));
    } else {
      this.getLocation(wx.getStorageSync('weather'));
      app.watch((value) => {
        console.log(value);
      })
    }
  },
  onReady: function () {
    // 首次进入，利用隐藏的judgeCanvas判断当前导出图像是否颠倒
    helper.checkOrientation('judgeCanvas');
    // 外层元素大小或组件显示状态变化时，可以调用此方法来触发重绘
    // this.selectComponent('#tabs').resize();
  },
  onShow: function () {
    if (app.globalData.hashLogin) { // 登录已完成
      this.getCalendarData(dateFormat(new Date()));
      console.log('1',app.globalData);
    } else {
      console.log('2',app.globalData);
      this.getCalendarData(dateFormat(new Date()));
      app.watch((value) => {
        console.log(value);
      })
    }
    // 调用监听器，监听需要分析的图片的数据变化，解决从其他页面切换回首页重复分析图片的bug，只在用户重新拍照后才进行分析
    app.watch1(this, {
      file: function (newVal) {
        this.afterRead(newVal);
      }
    })
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

  /* 获取卡片历史记录数据 */
  getCalendarData(date) {
    let that = this;
    app.appRequest('POST', 'analyze/calendarData', { date }).then(res => {
      if (res.statusCode === 200) {
        let calendarData = res.data.data;
        calendarData.reverse();
        that.setData({
          calendarData
        })
      } else {
        Dialog.alert({
          context: this,//代表的当前页面
          selector: "#van-dialog",//选择器
          title: '温馨提示',
          message: res.data.errors,
          theme: 'round-button',
        })
      }
    }).catch(error => {
      Dialog.alert({
        context: this,//代表的当前页面
        selector: "#van-dialog",//选择器
        title: '温馨提示',
        message: '出现了点错误，请稍后重试吧',
        theme: 'round-button',
      })
    })
  },

  /* 获取天气状况的方法 */
  getWeather(weather) {
    var that = this;
    app.appRequest('POST', 'wechat/getWeather', weather).then((res) => {
      const { data } = res.data;
      const { temp, uvi, humidity, pm25c } = data;
      Notify({ type: 'success', message: res.data.message });
      let { tempdata, humdata, pm25cdata } = that.data;
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
        case pm25c < 35:
          pm25cdata.icon = '/icon/pm2.5_l.png';
          break;
        case pm25c >= 35 && pm25c < 75:
          pm25cdata.icon = '/icon/pm2.5_m.png';
          break;
        default:
          pm25cdata.icon = '/icon/pm2.5_h.png';
          break;
      }
      that.setData({
        local_power: true,
        tempdata,
        temp, // 温度 单位摄氏度
        uvi, // 紫外线强度
        humidity, // 湿度 单位%
        pm25c // pm2.5浓度 单位μg/m³（微克每立方米）
      })
    }, err => {
      Dialog.alert({
        context: this,//代表的当前页面
        selector: "#van-dialog",//选择器
        title: '温馨提示',
        message: '出现了点错误，请稍后重试吧',
        theme: 'round-button',
      })
    }).catch(error => {
      Dialog.alert({
        context: this,//代表的当前页面
        selector: "#van-dialog",//选择器
        title: '温馨提示',
        message: '出现了点错误，请稍后重试吧',
        theme: 'round-button',
      })
    })
  },

  /* 引导设置点击事件 */
  next() {
    var that = this;
    let { leadTitle, leadTips, bluetooth } = this.data;
    if (leadTitle === '打开手机蓝牙') {
      // this.initBLE();
      leadTitle = '配对成功';
      leadTips = '连接WiFi获取肌肤秘方';
      bluetooth = '/icon/bluetooth_success.png';
    } else if (leadTitle === '配对成功') {
      leadTitle = '连接wifi';
      wx.startWifi({
        success(res) {
          console.log('startWifi', res.errMsg)
          wx.getConnectedWifi({
            success: function (res) {
              console.log('getConnectedWifi', res);
              that.setData({
                ssid: res.wifi.SSID
              })
            },
            fail: function (res) {
              if (res.errCode == 12006) {
                wx.showModal({
                  title: '请打开GPS定位',
                  content: 'Android手机不打开GPS定位，无法搜索到蓝牙设备.',
                  showCancel: false
                })
              }
              console.log('getConnectedWifi fail', res);
            }
          })
        }
      })
    }
    this.setData({
      loading: true
    })
    setTimeout(() => {
      this.setData({
        leadTitle,
        leadTips,
        bluetooth,
        loading: false
      })
    }, 500)
  },

  /* 引导设置完成表单提交事件 */
  wifiFormSubmit(e) {
    this.setData({
      leadshow: false
    })
  },

  /* 蓝牙初始化 */
  initBLE: function () {
    this.printLog("启动蓝牙适配器, 蓝牙初始化")
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('openBluetoothAdapter', res);
        that.findBLE();
      },
      fail: function (res) {
        console.log('openBluetoothAdapter fail', res);
        util.toastError('请先打开蓝牙');
      }
    })
  },

  findBLE: function () {
    this.printLog("打开蓝牙成功.")
    var that = this
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      interval: 0,
      success: function (res) {
        wx.showLoading({
          title: '正在搜索设备',
        })
        console.log('startBluetoothDevicesDiscovery', res);
        delayTimer = setInterval(function () {
          that.discoveryBLE() //3.0 //这里的discovery需要多次调用
        }, 1000);
        setTimeout(function () {
          if (isFound) {
            return;
          } else {
            wx.hideLoading();
            console.log("findBLE搜索设备超时");
            wx.stopBluetoothDevicesDiscovery({
              success: function (res) {
                console.log('findBLE连接蓝牙成功之后关闭蓝牙搜索');
              }
            })
            clearInterval(delayTimer)
            wx.showModal({
              title: '搜索设备超时',
              content: '请检查蓝牙设备是否正常工作，Android手机请打开GPS定位.',
              showCancel: false
            })
            util.toastError("搜索设备超时，请打开GPS定位，再搜索")
            return
          }
        }, 15000);
      },
      fail: function (res) {
        that.printLog("蓝牙设备服务发现失败: " + res.errMsg);
      }
    })
  },

  discoveryBLE: function () {
    var that = this
    wx.getBluetoothDevices({
      success: function (res) {
        var list = res.devices;
        console.log('getBluetoothDevices(设备列表)', list);
        if (list.length <= 0) {
          return;
        }
        var devices = [];
        for (var i = 0; i < list.length; i++) {
          //that.data.inputValue：表示的是需要连接的蓝牙设备ID，
          //简单点来说就是我想要连接这个蓝牙设备，
          //所以我去遍历我搜索到的蓝牙设备中是否有这个ID
          var name = list[i].name || list[i].localName;
          if (util.isEmpty(name)) {
            continue;
          }
          if (name.indexOf('MI') >= 0 && list[i].RSSI != 0) {
            console.log('被选中的设备', list[i]);
            devices.push(list[i]);
          }
        }
        console.log('总共有' + devices.length + "个设备需要设置")
        if (devices.length <= 0) {
          return;
        }
        that.connectBLE(devices);
      },
      fail: function () {
        util.toastError('搜索蓝牙设备失败');
      }
    })
  },

  connectBLE: function (devices) {
    this.printLog('总共有' + devices.length + "个设备需要设置")
    var that = this;
    wx.hideLoading();
    isFound = true;
    clearInterval(delayTimer);
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        that.printLog('连接蓝牙成功之后关闭蓝牙搜索');
      }
    })
    //两个的时候需要选择
    var list = [];
    for (var i = 0; i < devices.length; i++) {
      var name = devices[i].name || devices[i].localName;
      list.push(name + "[" + devices[i].deviceId + "]")
    }
    this.setData({
      deviceArray: list
    })
    //默认选择
    this.setData({
      currDeviceID: list[0]
    })
  },

  printLog: function (msg) {
    var logs = this.data.logs;
    logs.push(msg);
    this.setData({ logs: logs, scrollH: logs.length * 400 })
    /* wx.createSelectorQuery().select('.bottom').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec() */
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

/* 格式化时间 */
function dateFormat(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1

  return year + '-0' + month
}