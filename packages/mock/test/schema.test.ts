import { expect, test } from '@jest/globals'
import { CustomJSONSchema, mockFromSchema } from '../src/schema'
import { loop } from './_util'

const numberSchema: CustomJSONSchema = {
  type: 'number',
  format: 'integer',
  minimum: 0,
  maximum: 100
}

const numberOnlyMinSchema: CustomJSONSchema = {
  type: 'integer',
  format: 'natural',
  minimum: 100
}

const stringSchema: CustomJSONSchema = {
  type: 'string',
  format: 'cparagraph'
}

const boolSchema: CustomJSONSchema = {
  type: 'boolean'
}

const arrSchema: CustomJSONSchema = {
  type: 'array',
  minItems: 5,
  maxItems: 6,
  items: {
    type: 'string',
    format: 'csentence'
  }
}

const objSchema: CustomJSONSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      format: 'cname'
    },
    gender: {
      type: 'string',
      enum: ['男', '女']
    },
    age: {
      type: 'number',
      format: 'natural',
      minimum: 4,
      maximum: 64
    },
    children: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            format: 'cname'
          },
          gender: {
            type: 'string',
            enum: ['男', '女']
          },
          age: {
            type: 'number',
            format: 'natural',
            minimum: 4,
            maximum: 64
          }
        }
      }
    }
  }
}

const chineseCharWithPunctuation = /^[\u4e00-\u9fa5，。]+$/
const chineseName = /^[\u4e00-\u9fa5]{2,}$/

test('empty schema', () => {
  loop(() => {
    const mocked = mockFromSchema({})
    expect(typeof mocked).toBe('string')
    expect((mocked as string).length).toBeGreaterThanOrEqual(4)
    expect((mocked as string).length).toBeLessThanOrEqual(8)
  })
})

test('pure string schema', () => {
  loop(() => {
    const mocked = mockFromSchema(stringSchema)
    expect(typeof mocked).toBe('string')
    expect(mocked).toMatch(chineseCharWithPunctuation)
  })
})

test('pure number schema', () => {
  loop(() => {
    const mocked = mockFromSchema(numberSchema)
    expect(typeof mocked).toBe('number')
    expect(mocked).toBeGreaterThanOrEqual(0)
    expect(mocked).toBeLessThanOrEqual(100)
  })
})

test('pure number with only min schema', () => {
  loop(() => {
    const mocked = mockFromSchema(numberOnlyMinSchema)
    expect(typeof mocked).toBe('number')
    expect(mocked).toBeGreaterThanOrEqual(100)
  })
})

test('pure boolean schema', () => {
  loop(() => {
    const mocked = mockFromSchema(boolSchema)
    expect(typeof mocked).toBe('boolean')
  })
})

test('array schema', () => {
  loop(() => {
    const mocked = mockFromSchema(arrSchema) as Array<string>
    expect(Array.isArray(mocked)).toBe(true)
    expect(mocked.length).toBeGreaterThanOrEqual(5)
    expect(mocked.length).toBeLessThanOrEqual(6)
    expect(mocked.every(item => chineseCharWithPunctuation.test(item))).toBe(true)
  })
})

type Person = {
  name: string
  age: number
  gender: '男' | '女'
  children: Person[]
}

function mathchOnePerson(person: Person) {
  loop(() => {
    expect(Object.prototype.toString.call(person)).toBe('[object Object]')
    expect(typeof person.age).toBe('number')
    expect(person.age).toBeGreaterThanOrEqual(4)
    expect(person.age).toBeLessThanOrEqual(64)
    expect(typeof person.gender).toBe('string')
    expect(['男', '女'].includes(person.gender)).toBeTruthy()
    expect(typeof person.name).toBe('string')
    expect(person.name).toMatch(chineseName)
  })
}

test('object schema', () => {
  loop(() => {
    const mocked = mockFromSchema(objSchema) as Person
    mathchOnePerson(mocked)
    expect(Array.isArray(mocked.children)).toBe(true)
    expect(mocked.children.length).toBeGreaterThanOrEqual(1)
    expect(mocked.children.length).toBeLessThanOrEqual(3)
    for (const item of mocked.children) {
      mathchOnePerson(item)
    }
  })
})
