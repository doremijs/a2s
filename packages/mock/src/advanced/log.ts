/**
 * mock请求日志 服务器登录日志
 */
import { Random } from 'mockjs'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../data/log.json')

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

type IP = string

interface RequestLog {
  userAgent: string
  method: Method
  url: string
  ip: IP
  /**
   * UTC time
   */
  time: string
  /**
   * 单位ms
   */
  duration: number
}

interface LoginLog {
  user: string
  /**
   * UTC time
   */
  time: string
  ip: IP
}

//随机生成请求日志
function requestLog() {
  const uAindex = Math.floor(Math.random() * data[0].userAgent.length)
  const UA: string = data[0].userAgent[uAindex]
  const date = new Date(+new Date() + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
    .split(' ')
  const staged = date[0].split('-')[1]
  let month = ''
  switch (staged) {
    case '01':
      month = 'Jan'
      break
    case '02':
      month = 'Feb'
      break
    case '03':
      month = 'Mar'
      break
    case '04':
      month = 'Apr'
      break
    case '05':
      month = 'May'
      break
    case '06':
      month = 'June'
      break
    case '07':
      month = 'July'
      break
    case '08':
      month = 'Aug'
      break
    case '09':
      month = 'Sept'
      break
    case '10':
      month = 'Oct'
      break
    case '11':
      month = 'Nov'
      break
    case '12':
      month = 'Dec'
      break
  }
  const day = date[0].split('-')[2]
  const year = date[0].split('-')[0]
  const time = `[${day}/${month}/${year}:${date[1]} +0800]`
  const url = Random.url('http')
  const mIndex = Math.floor(Math.random() * data[1].methods.length)
  const method = data[1].methods[mIndex]
  const duration = Random.float(10, 100, 0, 2)
  return {
    UA: UA,
    time: time,
    url: url,
    method: method,
    duration: duration,
    ip: Random.ip(),
    date: date
  }
}

//随机生成服务器登录日志
function loginLog() {
  const user = Random.name()
  const myDate = requestLog().date
  const year = myDate[0].split('-')[0]
  const myTime = myDate[1]
  const day = myDate[0].split('-')[2]
  const d = new Date().getDay()
  let week = ''
  switch (d) {
    case 0:
      week = 'Sun'
      break
    case 1:
      week = 'Mon'
      break
    case 2:
      week = 'Tue'
      break
    case 3:
      week = 'Wed'
      break
    case 4:
      week = 'Thu'
      break
    case 5:
      week = 'Fri'
      break
    case 6:
      week = 'Sat'
      break
  }
  const staged = myDate[0].split('-')[1]
  let month = ''
  switch (staged) {
    case '01':
      month = 'Jan'
      break
    case '02':
      month = 'Feb'
      break
    case '03':
      month = 'Mar'
      break
    case '04':
      month = 'Apr'
      break
    case '05':
      month = 'May'
      break
    case '06':
      month = 'June'
      break
    case '07':
      month = 'July'
      break
    case '08':
      month = 'Aug'
      break
    case '09':
      month = 'Sept'
      break
    case '10':
      month = 'Oct'
      break
    case '11':
      month = 'Nov'
      break
    case '12':
      month = 'Dec'
      break
  }
  const time = `${week} ${month} ${day} ${myTime} ${year}`
  return {
    user: user,
    time: time,
    ip: Random.ip()
  }
}

export function mockIP(): IP {
  return Random.ip()
}

export function mockRequestLogs(): RequestLog[] {
  const obj = requestLog()
  return [
    {
      userAgent: obj.UA,
      method: obj.method,
      url: obj.url,
      ip: obj.ip,
      time: obj.time,
      duration: obj.duration
    }
  ]
}

export function mockLoginLogs(): LoginLog[] {
  const obj = loginLog()
  return [
    {
      user: obj.user,
      time: obj.time,
      ip: obj.ip
    }
  ]
}
