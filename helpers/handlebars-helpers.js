const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
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
  fullDate: date => {
    return dayjs(date)
      .tz('Asia/Taipei')
      .format('YYYY/MM/DD')
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  orCond: function (a, b, c, options) {
    return a || (b === c) ? options.fn(this) : options.inverse(this)
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
