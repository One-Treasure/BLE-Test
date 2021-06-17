var formatTime = date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

var formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

var formatTime = date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

var formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var isEmpty = function (str) {
  if (str == null || str == undefined || str == "") {
    return true;
  }
  return false;
}

var randomWord = function (range) {
  var str = "",
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // 随机产生
  for (var i = 0; i < range; i++) {
    var pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

var toastServerError = function () {
  wx.showToast({
    title: '服务器异常，请稍后重试！',
    icon: 'none',
    duration: 1200,
    mask: true
  })
}
var toastError = function (info) {
  wx.showToast({
    title: info,
    icon: 'none',
    duration: 1200,
    mask: true
  })
}

// 使用函数节流防止重复点击
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

module.exports = {
  formatTime,
  formatTime: formatTime,
  isEmpty: isEmpty,
  toastServerError: toastServerError,
  toastError: toastError,
  randomWord: randomWord,
  throttle: throttle
}
