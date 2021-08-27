//npx jest .\test\advanced.test.ts
//majestic
import { test } from '@jest/globals'
import {
  mockProvinces,
  mockCities,
  mockDistricts,
  mockIdCard,
  mockMobile,
  mockUrl,
  mockIP,
  mockRequestLogs,
  mockLoginLogs,
  mockDepartment,
  mockJob
} from '../src/advanced'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logData = require('../src/data/log.json')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const departmentData = require('../src/data/departments.json')

//region测试
test('default province mock', () => {
  // loop(() => {
  const defaultRegionMock = mockProvinces()
  expect(defaultRegionMock.length).toBeGreaterThanOrEqual(1)
  expect(defaultRegionMock.every(item => 'code' && 'name' && 'cities' in item)).toBe(true)
  expect(defaultRegionMock.every(item => typeof item.code === 'string')).toBe(true)
  expect(defaultRegionMock.every(item => typeof item.name === 'string')).toBe(true)
  expect(defaultRegionMock.every(item => typeof item.cities === 'object')).toBe(true)
  // })
})

test('default city mock', () => {
  const defaultRegionMock = mockCities('32')
  expect(defaultRegionMock.length).toBeGreaterThanOrEqual(1)
  expect(defaultRegionMock.every(item => 'code' && 'name' && 'districts' in item)).toBe(true)
  expect(defaultRegionMock.every(item => typeof item.code === 'string')).toBe(true)
  expect(defaultRegionMock.every(item => typeof item.name === 'string')).toBe(true)
  expect(defaultRegionMock.every(item => typeof item.districts === 'object')).toBe(true)
})

test('default districts mock', () => {
  const defaultRegionMock = mockDistricts('320900000000')
  expect(defaultRegionMock.length).toBeGreaterThanOrEqual(1)
  expect(defaultRegionMock.every(item => 'code' && 'name' in item)).toBe(true)
  expect(defaultRegionMock.every(item => typeof item.code === 'string')).toBe(true)
  expect(defaultRegionMock.every(item => typeof item.name === 'string')).toBe(true)
})

//idCards测试
test('default idCard mock', () => {
  const defaultIdCardMock = mockIdCard()
  expect(defaultIdCardMock.length).toEqual(18)
  for (let i = 0; i < 17; i++) {
    const reg = /^[0-9]+$/
    expect(reg.test(defaultIdCardMock[i])).toBe(true)
  }
  const reg = /^[0-9]+$|X/
  expect(reg.test(defaultIdCardMock[17])).toBe(true)
})

//mobile测试
test('default mobile mock', () => {
  const defaultMobile = mockMobile()
  expect(defaultMobile.length).toEqual(11)
  // const reg = /^[0-9]+$/
  const reg = new RegExp('^[0-9]', 'g')
  expect(reg.test(defaultMobile)).toBe(true)
  expect(defaultMobile[0] === '1').toBe(true)
})

//url测试
test('default url mock', () => {
  const defaultUrl = mockUrl({ type: 'image' })
  expect(defaultUrl.length).toBeGreaterThan(8)
  const reg = new RegExp('^(http|https)://', 'i')
  expect(reg.test(defaultUrl)).toBe(true)
})

//log测试
test('default ip mock', () => {
  const defaultIp = mockIP()
  expect(defaultIp.length).toBeLessThanOrEqual(15)
  expect(defaultIp.length).toBeGreaterThanOrEqual(7)
  const reg = new RegExp('^[0-9]|.', 'g')
  expect(reg.test(defaultIp)).toBe(true)
  const regx = /^([1-9]\d?|1\d{2}|2[0-4]\d|25[0-5])(\.([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
  expect(regx.test(defaultIp)).toBe(true)
  expect(typeof defaultIp === 'string').toBe(true)
})

test('default requestLog mock', () => {
  const defaultRequestLog = mockRequestLogs()
  expect(defaultRequestLog.length).toBeGreaterThanOrEqual(1)
  const reg = new RegExp('^(http|https)://', 'i')
  expect(reg.test(defaultRequestLog[0].url)).toBe(true)
  expect(logData[0].userAgent.includes(defaultRequestLog[0].userAgent)).toBe(true)
  expect(logData[1].methods.includes(defaultRequestLog[0].method)).toBe(true)
  expect(typeof defaultRequestLog[0].ip === 'string').toBe(true)
  expect(typeof defaultRequestLog[0].url === 'string').toBe(true)
  expect(typeof defaultRequestLog[0].time === 'string').toBe(true)
  expect(typeof defaultRequestLog[0].userAgent === 'string').toBe(true)
  expect(typeof defaultRequestLog[0].duration === 'number').toBe(true)
})

test('default loginLog mock', () => {
  const defaultLoginLog = mockLoginLogs()
  expect(defaultLoginLog.length).toBeGreaterThanOrEqual(1)
  expect(typeof defaultLoginLog[0].user === 'string').toBe(true)
  expect(typeof defaultLoginLog[0].time === 'string').toBe(true)
  expect(typeof defaultLoginLog[0].ip === 'string').toBe(true)
})

//departments测试
test('default department mock', () => {
  const defaultDepartment = mockDepartment()
  expect(defaultDepartment.length).toBeGreaterThanOrEqual(1)
  const department = []
  departmentData.forEach(element => {
    department.push(element.department)
  })
  expect(department.includes(defaultDepartment)).toBe(true)
})

test('default job mock', () => {
  const defaultJob = mockJob()
  expect(defaultJob.length).toBeGreaterThanOrEqual(1)
  const job = []
  departmentData.forEach(element => {
    element.position.forEach(ele => {
      job.push(ele)
    })
  })
  expect(job.includes(defaultJob)).toBe(true)
})
