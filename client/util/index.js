import Moment from 'moment-timezone'

const getErrorResponse = (error) => {
  if (error.response && error.response.data && error.response.data.message) return error.response.data.message
  if (error.response && error.response.statusText) return error.response.statusText
  return error.message || 'There is error.'
}

const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss', isEmpty = false, timeZone = null) => {
  if (date) {
    if (timeZone) {
      return Moment.utc(date).tz(timeZone).format(format)
    } else {
      return Moment(date).format(format)
    }
  } else {
    return isEmpty ? null : Moment().format(format)
  }
}

export default {
  getErrorResponse,
  formatDateTime
}