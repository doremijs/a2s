/**
 * mock请求日志 服务器登录日志
 */

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

export function mockIp(): IP {
  //
}

export function mockRequestLogs(): RequestLog[] {
  //
}

export function mockLoginLogs(): LoginLog[] {
  //
}
