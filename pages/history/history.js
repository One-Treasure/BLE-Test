import Dialog from '@vant/weapp/dialog/dialog';
var app = getApp();
var score = 0;

// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#FF75A0' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#FF75A0' }
    ],
    num: [],
    activeIndex: 0,//默认放大显示的卡片角标
    cur: 0,
    opts: {
      onInit: initChart
    },
    sel_time: ['近一周', '近一月', '近90天'],
    curIndex: 0,
    left: '',
    score: score
  },

  /* 切换卡片事件 */
  swiperChange(e) {
    const { current } = e.detail;
    const { calendarData } = this.data;
    if (calendarData.length > 0) {
      let day = calendarData[current].date.split('-')[2];
      let changeBgColor = `dayStyle[0].color`;
      let changeBg = `dayStyle[0].background`;
      let changeDay = `dayStyle[1].day`;
      let changeEndBg = `dayStyle[1].background`;
      this.setData({
        [changeDay]: day,
        [changeBg]: "rgba(255,255,255,0)",
        [changeBgColor]: "black",
        [changeEndBg]: "#FF75A0",
        activeIndex: current
      })
    }
  },

  //给点击的日期设置一个背景颜色
  dayClick: function (event) {
    const day = event.detail.year + '-0' + event.detail.month + '-' + event.detail.day;
    const { calendarData } = this.data;
    let clickDay = event.detail.day;
    let changeBgColor = `dayStyle[0].color`;
    let changeBg = `dayStyle[0].background`;
    let changeDay = `dayStyle[1].day`;
    let changeEndBg = `dayStyle[1].background`;
    calendarData.forEach((v, i) => {
      if (v.date === day) {
        this.setData({
          cur: i
        })
      }
    });
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "rgba(255,255,255,0)",
      [changeBgColor]: "black",
      [changeEndBg]: "#FF75A0",
    })
  },

  /* 切换上个月的点击事件 */
  prevMonth(e) {
    const date = e.detail.currentYear + '-0' + e.detail.currentMonth
    this.getCalendarData(date);
  },

  /* 切换下个月的点击事件 */
  nextMonth(e) {
    const date = e.detail.currentYear + '-0' + e.detail.currentMonth
    this.getCalendarData(date);
  },

  /* 获取卡片历史记录数据 */
  getCalendarData(date) {
    let that = this;
    app.appRequest('POST', 'analyze/calendarData', { date }).then(res => {
      if (res.statusCode === 200) {
        let calendarData = res.data.data;
        calendarData.reverse();
        that.setData({
          calendarData,
          cur: 0,
          activeIndex: 0
        })
        setTimeout(() => {
          that.setData({
            cur: 1,
            activeIndex: 1
          })
        }, 100);
      } else {
        Dialog.alert({
          context: that,//代表的当前页面
          selector: "#van-dialog",//选择器
          title: '温馨提示',
          message: '出现了点错误，请稍后重试吧',
          theme: 'round-button',
        })
      }
    }).catch(error => {
      Dialog.alert({
        context: that,//代表的当前页面
        selector: "#van-dialog",//选择器
        title: '温馨提示',
        message: '出现了点错误，请稍后重试吧',
        theme: 'round-button',
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* this.setData({
      index: 50
    }) */
    this.changeline(1);
    this.getCalendarData(dateFormat(new Date()));
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

  },

  /* 自定义tab栏点击事件 */
  changeTab(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      curIndex: index
    })
    this.changeline(e)
    if (index === 0) {
      userday = 7
    } else if (index === 1) {
      userday = 30
    } else {
      userday = 90
    }
    let day = userday;
    /* app.appRequest('POST', 'analyze/trend', { day }).then(res => {
      const result = res.data.data;
      let file = [];
      for (var i in result.trend) {
        let obj = {};
        obj.date = i;
        obj.steps = result.trend[i].score;
        file.push(obj);
      }
      chart.changeData(file);
    }) */
    this.ecComponent = this.selectComponent('#column-dom');
    this.ecComponent.init(initChart);
  },

  /* 自定义tab栏下划线位置改变事件 */
  changeline: function () {
    var that = this
    const query = wx.createSelectorQuery()
    query.select('.active').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        left: res[0].left - res[0].height + 5.5
      })
    })
  },

})

let chart = null;
var userday = 7;

function formatNumber(n) {
  return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function initChart(canvas, width, height, F2) { // 使用 F2 绘制图表
  const day = userday;
  app.appRequest('POST', 'analyze/trend', { day }).then(res => {
    const result = res.data.data;
    let file = [];
    for (var i in result.trend) {
      let obj = {};
      obj.date = i;
      obj.steps = result.trend[i].score;
      file.push(obj);
    }
    const data = file;
    const originDates = [];
    const originSteps = [];
    const firstDayArr = [];
    /* data.forEach(function (obj) {
      if (obj.date >= '2021-05-01') {
        originDates.push(obj.date);
        originSteps.push(obj.steps);
      }
      if (obj.first) {
        firstDayArr.push(obj);
      }
    }); */

    chart = new F2.Chart({
      el: canvas,
      width,
      height: height - 20
    });

    chart.source(data, {
      sortable: false,
      date: {
        type: 'timeCat',
        tickCount: 7,
        /* values: originDates, */
        mask: 'MM-DD',
        range: [0, 1]
      },
      steps: {
        tickCount: 5,
        min: 60,
        max: 100
      }
    });
    chart.axis('date', {
      tickLine: {
        length: 4,
        stroke: '#cacaca'
      },
      label: {
        fill: '#cacaca'
      },
      line: {
        top: true
      }
    });
    chart.axis('steps', {
      position: 'right',
      label: function label(text) {
        return {
          text: formatNumber(text * 1),
          fill: '#cacaca'
        };
      },
      grid: {
        stroke: '#FF75A0'
      }
    });
    chart.tooltip({
      showItemMarker: false,
      showCrosshairs: true,
      showItemMarker: false,
      triggerOn: ['touchstart'],
      background: {
        radius: 2,
        fill: '#FF75A0',
        padding: [3, 5]
      },
      nameStyle: {
        fill: '#fff'
      },
      crosshairsStyle: {
        stroke: '#fff',
        lineWidth: 2
      },
      onShow(ev) {
        const { items } = ev;
        items[0].name = '日期：' + items[0].title;
        items[0].value = '';
        items[1].name = '得分';
        items[1].value = items[1].value + '分';
        score = ev.items[0].origin.steps
        console.log('ev',ev);
        var pages = getCurrentPages()
        var currentPage = pages[pages.length - 1]
        currentPage.setData({
          score
        })
      },
    });

    chart.line().position('date*steps').shape('smooth').color('#FF75A0');
    chart.point().position('date*steps').shape('smooth').style({
      lineWidth: 1,
      stroke: '#FFF'
    }).color('#FF75A0');
    chart.area().position('date*steps').color('l(90) 0:#FF75A0 1:#FFD7E4').shape('smooth').style({
      fillOpacity: 0.51
    });

    /* firstDayArr.forEach(function (obj) {
      chart.guide().line({
        top: false,
        start: [obj.date, 'min'],
        end: [obj.date, 'max'],
        style: {
          lineWidth: 1,
          stroke: '#A4A4A4'
        }
      });
      chart.guide().text({
        position: [obj.date, 'max'],
        content: obj.date,
        style: {
          textAlign: 'start',
          fill: '#cacaca',
          textBaseline: 'top'
        },
        offsetX: 5,
        offsetY: 5
      });
    }); */
    // 定义进度条
    /* chart.scrollBar({
      mode: 'x',
      xStyle: {
        backgroundColor: '#FFFFFF',
        fillerColor: '#FF75A0',
        offsetY: -2
      }
    });
    chart.interaction('pan'); */
    chart.render();
    return chart;
  }).catch(error => {
    Dialog.alert({
      context: this,//代表的当前页面
      selector: "#van-dialog",//选择器
      title: '温馨提示',
      message: '出现了点错误，请稍后重试吧',
      theme: 'round-button',
    })
  })
}

/* 格式化时间 */
function dateFormat(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1

  return year + '-0' + month
}