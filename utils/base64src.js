const fsm = wx.getFileSystemManager()
const FILE_BASE_NAME = 'tmp_base64src'

function base64src (base64data, cb) {
  const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
  if (!format) {
    return (new Error('ERROR_BASE64SRC_PARSE'))
  }
  //随机定义路径名称
  var times = new Date().getTime();
  var filePath = wx.env.USER_DATA_PATH + '/' + times + '.png';
  const buffer = wx.base64ToArrayBuffer(bodyData)
  fsm.writeFile({
    filePath,
    data: buffer,
    encoding: 'binary',
    success () {
      cb(filePath)
    },
    fail () {
      return (new Error('ERROR_BASE64SRC_WRITE'))
    }
  })
}
export { base64src }