const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
  currentYear: () => dayjs().year(),
  fullDateTime: time => {
    return dayjs(time)
      .tz('Asia/Taipei')
      .format('YYYY/MM/DD HH:mm:ss')
  },
  simpleDateTime: time => {
    return dayjs(time)
      .tz('Asia/Taipei')
      .format('MM/DD HH:mm')
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  ifOut: function (a, b, c, options) {
    return ((a > b) || (a < c)) ? options.fn(this) : options.inverse(this)
  },
  // 展示問題血壓
  ifPresOut: function (a, b, c, d, e, options) {
    const x = a.split('/')
    return ((x[0] > b) || (x[0] < c) || (x[1] > d) || (x[1] < e)) ? options.fn(this) : options.inverse(this)
  }
}
