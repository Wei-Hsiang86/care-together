const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
  currentYear: () => dayjs().year(),
  inputTime: time => {
    return dayjs(time)
      .tz('Asia/Taipei')
      .format('YYYY/MM/DD HH:mm:ss')
  }
}
