const StartOfDay = require('date-fns/start_of_day')
const EndOfDay = require('date-fns/end_of_day')
const SubDays = require('date-fns/sub_days')

const StartOfMonth = require('date-fns/start_of_month')
const EndOfMonth = require('date-fns/end_of_month')
const SubMonths = require('date-fns/sub_months')

const Format = require('date-fns/format')

class DateRange {
  static commonRanges () {
    let today = new Date()
    let yesterday = SubDays(today, 1)
    let daysAgo7 = SubDays(today, 7)
    let daysAgo30 = SubDays(today, 30)
    let lastMonth = SubMonths(today, 1)

    return {
      'Today': new DateRange(StartOfDay(today), EndOfDay(today)),
      'Yesterday': new DateRange(StartOfDay(yesterday), EndOfDay(yesterday)),
      'Last 7 Days': new DateRange(StartOfDay(daysAgo7), EndOfDay(today)),
      'Last 30 Days': new DateRange(StartOfDay(daysAgo30), EndOfDay(today)),
      'This Month': new DateRange(StartOfMonth(today), EndOfMonth(today)),
      'Last Month': new DateRange(StartOfMonth(lastMonth), EndOfMonth(lastMonth))
    }
  }

  constructor (start, end) {
    let today = new Date()
    let daysAgo7 = SubDays(today, 7)

    if (!start) {
      start = daysAgo7
    }

    if (!end) {
      end = today
    }

    this.start = StartOfDay(start)
    this.end = EndOfDay(end)
  }

  toString (formatFnc) {
    if (typeof formatFnc === 'function') {
      return formatFnc(this.start, this.end)
    }

    let start = Format(this.start, 'YYYY-MM-DD')
    let end = Format(this.end, 'YYYY-MM-DD')

    return `${start} to ${end}`
  }

  toData (normal) {
    return {
      start: normal ? Format(this.start, 'YYYY-MM-DD') : this.start.toISOString(),
      end: normal ? Format(this.end, 'YYYY-MM-DD') : this.end.toISOString()
    }
  }
}

let CapitalizeFirstLetter = (value) => {
  if (!value) {
    return ''
  }
  return value.charAt(0).toUpperCase() + value.slice(1)
}

let SanitizeObject = (obj) => {
  let result = {}

  for (let prop in obj) {
    if (obj[prop] !== null) {
      result[prop] = obj[prop]
    }
  }

  return JSON.stringify(result, null, '\t')
}

const Colors = JSON.parse('{ "default": ["#df405a", "#8f30ad", "#ee6e9f", "#fc9d9a", "#8aba56", "#fbb03b", "#5482ab", "#87314e", "#8283a7", "#54546c", "#f38654", "#41afa5", "#3bb2d0", "#4f5b93"], "darker": ["#db2a47","#7f2a99","#eb5790","#fb8581","#7daf47","#faa622","#4c759a","#742a43","#73749c","#49495e","#f1753c","#3a9c93","#2fa5c3","#465182"], "lighter": ["#e66c80","#ab45cb","#f39cbd","#fdcdcc","#a3c97a","#fcc46d","#769bbc","#ac3f64","#a0a1bc","#6a6a89","#f6a884","#5fc4bb","#64c2da","#6774ae"] }')
export { DateRange, Colors, CapitalizeFirstLetter, SanitizeObject }
