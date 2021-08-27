/**
 * mock手机号码(网络识别号+地区编号+用户号码)
 */
import { Random } from 'mockjs'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../data/mobile.json')

function mobiles() {
  //手机前三位
  const code = []
  data.forEach(element => {
    code.push(element.code)
  })
  const index = Math.floor(Math.random() * code.length)
  const childIndex = Math.floor(Math.random() * code[index].length)
  const third = code[index][childIndex]
  //后七位
  let seventh = ''
  for (let i = 0; i < 8; i++) {
    const staged = Random.integer(0, 9)
    seventh += staged
  }
  const mobiles = third + seventh
  return mobiles
}
export function mockMobile(): string {
  return mobiles()
}
