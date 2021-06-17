let chart = null;

function formatNumber(n) {
  return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function initChart(canvas, width, height, F2) { // 使用 F2 绘制图表
  const data = [
    /* {
      "date": "2018-05-01",
      "steps": 97,
      "first": true
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
    }, */
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
    if (obj.date >= '2018-05-16') {
      originDates.push(obj.date);
      originSteps.push(obj.steps);
    }
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
      tickCount: 7,
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