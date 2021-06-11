let chart = null;

function formatNumber(n) {
  return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function initChart(canvas, width, height, F2) { // 使用 F2 绘制图表
  const data = [
    {
      "date": "2018-05-01",
      "steps": 97,
      /* "first": true */
    },
    {
      "date": "2018-05-02",
      "steps": 90
    },
    {
      "date": "2018-05-03",
      "steps": 88
    },
    {
      "date": "2018-05-04",
      "steps": 91
    },
    {
      "date": "2018-05-06",
      "steps": 93
    },
    {
      "date": "2018-05-07",
      "steps": 85
    },
    {
      "date": "2018-05-08",
      "steps": 75
    },
    {
      "date": "2018-05-09",
      "steps": 82
    },
    {
      "date": "2018-05-10",
      "steps": 90
    },
    {
      "date": "2018-05-11",
      "steps": 98
    },
    {
      "date": "2018-05-12",
      "steps": 99
    },
    {
      "date": "2018-05-13",
      "steps": 91
    },
    {
      "date": "2018-05-14",
      "steps": 73
    },
    {
      "date": "2018-05-15",
      "steps": 75
    },
    {
      "date": "2018-05-16",
      "steps": 77
    },
    {
      "date": "2018-05-17",
      "steps": 85
    },
    {
      "date": "2018-05-18",
      "steps": 86
    },
    {
      "date": "2018-05-19",
      "steps": 95
    },
    {
      "date": "2018-05-20",
      "steps": 93
    },
    {
      "date": "2018-05-21",
      "steps": 91
    },
    {
      "date": "2018-05-22",
      "steps": 98
    }
  ]
  const originDates = [];
  const originSteps = [];
  const firstDayArr = [];
  data.forEach(function (obj) {
    if (obj.date >= '2018-05-18') {
      originDates.push(obj.date);
      originSteps.push(obj.steps);
    }
    console.log(obj);
    if (obj.first) {
      firstDayArr.push(obj);
    }
  });

  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    sortable: false,
    date: {
      type: 'timeCat',
      tickCount: 5,
      values: originDates,
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
    background: {
      radius: 2,
      fill: '#1890FF',
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
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = items[0].value + '分';
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
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      backgroundColor: '#FFFFFF',
      fillerColor: '#FF75A0',
      offsetY: -2
    }
  });
  chart.interaction('pan');
  chart.render();
  /* const data = [
    {
      date: '2021-6-15',
      count: 90
    },
    {
      date: '2021-6-16',
      count: 88
    },
    {
      date: '2021-6-17',
      count: 95
    },
    {
      date: '2021-6-18',
      count: 91
    },
    {
      date: '2021-6-19',
      count: 96
    },
    {
      date: '2021-6-20',
      count: 99
    },
    {
      date: '2021-6-21',
      count: 99
    },
    {
      date: '2021-6-22',
      count: 99
    },
  ];
  const originDates = [];
  const originSteps = [];
  const firstDayArr = [];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  data.forEach(function (obj) {
    if (obj.date >= '2021-06-15') {
      originDates.push(obj.date);
      originSteps.push(obj.steps);
    }

    if (obj.first) {
      firstDayArr.push(obj);
    }
  });
  chart.source(data, {
    date: {
      nice: true,
      isRounding: true,
      type: 'timeCat',
      values: originDates,
      mask: 'MM/DD'
    },
    count: {
      min: 60,
      max: 100,
      tickCount: 5
    }
  });
  chart.tooltip({
    showItemMarker: false,
    showCrosshairs: true,
    showItemMarker: false,
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
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = items[0].value + '分';
    },
  });
  chart.axis('count', {
    position: 'right',
    label: function label(text) {
      return {
        text: formatNumber(text * 1),
        fill: '#cacaca'
      };
    },

    grid: {
      stroke: '#d1d1d1'
    }
  });
  chart.line().position('date*count').shape('smooth').color('#FF75A0');
  chart.point().position('date*count').shape('smooth').style({
    lineWidth: 1,
    stroke: '#fff'
  }).color('#FF75A0');
  chart.area().position('date*count').color('#FF75A0').shape('smooth');

  firstDayArr.forEach(function (obj) {
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
  });
  // 定义进度条
  chart.scrollBar({
    mode: 'x',
    backgroundColor: '#FF75A0',
    fillColor: 'rgba(255, 117, 160, 0.51)',
    xStyle: {
      offsetY: -5
    }
  });
  chart.interaction('pan');

  // 绘制 tag
  chart.guide().tag({
    position: [2011, 88],
    withPoint: false,
    content: '88',
    limitInPlot: true,
    offsetX: 5,
    direct: 'cr'
  });
  chart.render(); */
  /* chart.source(data, {
    date: {
      range: [0, 1],
      type: 'timeCat',
      mask: 'MM/DD',
      tickCount: 6
    },
    value: {
      min: 60,
      max: 100,
      tickCount: 5
    }
  });
  chart.tooltip({
    showItemMarker: false,
    showCrosshairs: true,
      showItemMarker: false,
      background: {
        radius: 2,
        fill: '#1890FF',
        padding: [ 3, 5 ]
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
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = items[0].value + '分';
    },
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.line().position('date*value').shape('smooth').color('#FF75A0');
  chart.point().position('date*value').shape('smooth')
    .style({
      stroke: '#fff',
      lineWidth: 1
    }).color('#FF75A0');
  chart.area().position('date*value').color('#FF75A0').shape('smooth');
  chart.interaction('pan');
  // 定义进度条
  chart.scrollBar({
    mode: 'x',
    xStyle: {
      offsetY: -5
    }
  });

  // 绘制 tag
  chart.guide().tag({
    position: [6 / 16, 1344],
    withPoint: false,
    content: '1,344',
    limitInPlot: true,
    offsetX: 5,
    direct: 'cr'
  });
  chart.render(); */
  return chart;
}

Page({
  data: {
    opts: {
      onInit: initChart
    }
  },

  onReady() {
  }
});
/* require('../../utils/f2.all.min');
Page({
  data: {
    onInitChart(F2, config) {
      const chart = new F2.Chart(config);
      const data = [
        { value: 93, city: 'New York', date: '2021-06-15' },
        { value: 95, city: 'New York', date: '2021-06-16' },
        { value: 90, city: 'New York', date: '2021-06-17' },
        { value: 92, city: 'New York', date: '2021-06-18' },
        { value: 91, city: 'New York', date: '2021-06-19' },
        { value: 96, city: 'New York', date: '2021-06-20' },
      ];
      chart.source(data, {
        date: {
          range: [0, 1],
          type: 'timeCat',
          mask: 'MM/DD',
          tickCount: 6
        },
        value: {
          min: 60,
          max: 100,
          tickCount: 5,
          alias: '当日得分'
        }
      });
      chart.axis('date', {
        label: function label(text, index, total) {
          const textCfg = {};
          if (index === 0) {
            textCfg.textAlign = 'left';
          } else if (index === total - 1) {
            textCfg.textAlign = 'right';
          }
          return textCfg;
        }
      });
      chart.tooltip({
        showCrosshairs: true
      });
      chart.area().position('date*value').color('#FF75A0').adjust('stack');
      chart.line().position('date*value').color('#FF75A0').adjust('stack');
      chart.line().position('date*value').shape('smooth').color('#FF75A0');
      chart.point().position('date*value').shape('smooth')
        .style({
          stroke: '#fff',
          lineWidth: 1
        }).color('#FF75A0');
      chart.area().position('date*value').color('#FF75A0').shape('smooth');
      chart.interaction('pan');
      // 定义进度条
      chart.scrollBar({
        mode: 'x',
        xStyle: {
          offsetY: -5
        }
      });

      // 绘制 tag
      chart.guide().tag({
        position: [1969, 1344],
        withPoint: false,
        content: '1,344',
        limitInPlot: true,
        offsetX: 5,
        direct: 'cr'
      });
      chart.render();
      // 注意：需要把chart return 出来
      return chart;
    }
  },
}); */