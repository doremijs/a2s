/**
 * mock 部门岗位等
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../data/departments.json')

function information() {
  const department = []
  const position = []
  data.forEach(element => {
    department.push(element.department)
    position.push(element.position)
  })
  const index = Math.floor(Math.random() * department.length)
  const childIndex = Math.floor(Math.random() * position[index].length)
  return {
    department: department[index],
    position: position[index][childIndex]
  }
}

export function mockDepartment(): string {
  const obj = information()
  return obj.department
}

export function mockJob(): string {
  const obj = information()
  return obj.position
}
