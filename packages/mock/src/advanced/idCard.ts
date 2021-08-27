/**
 * mock身份证
 */
import { Random } from 'mockjs'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../data/idCards.json')

function idCards() {
  const city = []
  const code: number[] = []
  //随机获取data数据里某个districts的code（作为身份证前6位）
  data.forEach(element => {
    city.push(element.cities)
  })
  const index = Math.floor(Math.random() * city.length)
  city[index].forEach(ele => {
    ele.districts.forEach(item => {
      code.push(item.code)
    })
  })
  const codeIndex = Math.floor(Math.random() * code.length)
  const sixth = code[codeIndex]
  //随机生成年月日(作为身份证7-14位)
  const date = Random.date().split('-')
  const fourteenth = date[0] + date[1] + date[2]
  //随机生成1-99的整数(作为15-16位)
  const num = Random.integer(1, 99)
  let sixteenth = null
  if (num < 10) {
    sixteenth = '0' + num
  } else {
    sixteenth = String(num)
  }
  //随机生成1-10的整数(作为17位，10用X表示)
  const number = Random.integer(1, 10)
  let seventeenth = ''
  let verify: number = null
  if (number < 10) {
    seventeenth = String(number)
    //生成最后一位数
    verify =
      (sixth[0] * 7 +
        sixth[1] * 9 +
        sixth[2] * 10 +
        sixth[3] * 5 +
        sixth[4] * 8 +
        sixth[5] * 4 +
        Number(fourteenth[0]) * 2 +
        Number(fourteenth[1]) * 1 +
        Number(fourteenth[2]) * 6 +
        Number(fourteenth[3]) * 3 +
        Number(fourteenth[4]) * 7 +
        Number(fourteenth[5]) * 9 +
        Number(fourteenth[6]) * 10 +
        Number(fourteenth[7]) * 5 +
        Number(sixteenth[0]) * 8 +
        Number(sixteenth[1]) * 4 +
        Number(seventeenth) * 2) %
      11
  } else {
    seventeenth = 'X'
    verify =
      (sixth[0] * 7 +
        sixth[1] * 9 +
        sixth[2] * 10 +
        sixth[3] * 5 +
        sixth[4] * 8 +
        sixth[5] * 4 +
        Number(fourteenth[0]) * 2 +
        Number(fourteenth[1]) * 1 +
        Number(fourteenth[2]) * 6 +
        Number(fourteenth[3]) * 3 +
        Number(fourteenth[4]) * 7 +
        Number(fourteenth[5]) * 9 +
        Number(fourteenth[6]) * 10 +
        Number(fourteenth[7]) * 5 +
        Number(sixteenth[0]) * 8 +
        Number(sixteenth[1]) * 4 +
        10 * 2) %
      11
  }
  let eighteenth = ''
  switch (verify) {
    case 0:
      eighteenth = '1'
      break
    case 1:
      eighteenth = '0'
      break
    case 2:
      eighteenth = 'X'
      break
    case 3:
      eighteenth = '9'
      break
    case 4:
      eighteenth = '8'
      break
    case 5:
      eighteenth = '7'
      break
    case 6:
      eighteenth = '6'
      break
    case 7:
      eighteenth = '5'
      break
    case 8:
      eighteenth = '4'
      break
    case 9:
      eighteenth = '3'
      break
    case 10:
      eighteenth = '2'
      break
  }
  const id = String(sixth) + String(fourteenth) + sixteenth + seventeenth + eighteenth
  return id
}
export function mockIdCard(): string {
  return idCards()
}
