// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}


export function datetimeFilter(val) {
  var date = new Date(val);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m < 10 && (m = "0" + m);
  var d = date.getDate();
  d < 10 && (d = "0" + d);
  var h = date.getHours();
  // h > 12 && (h -= 12);
  // h < 10 && (h = "0" + h);
  var M = date.getMinutes();
  M < 10 && (M = "0" + M);
  return `${y}-${m}-${d} ${h}:${M}`;
}

export function datetimeFilterDay(val) {
  var date = new Date(val);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m < 10 && (m = "0" + m);
  var d = date.getDate();
  d < 10 && (d = "0" + d);
  return `${y}-${m}-${d}`;
}

