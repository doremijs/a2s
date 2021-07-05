import mockFromSchema, { CustomJSONSchema } from '../src'

const numberSchema: CustomJSONSchema = {
  type: 'number',
  format: 'float',
  minimum: 0,
  maximum: 100
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
      format: 'pick',
      mockArgs: ['男', '女']
    },
    age: {
      type: 'number',
      format: 'natural',
      minimum: 4,
      maximum: 64
    },
    children: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            format: 'cname'
          },
          gender: {
            type: 'string',
            format: 'pick',
            mockArgs: ['男', '女']
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

console.log(mockFromSchema({}))
console.log(mockFromSchema(stringSchema))
console.log(mockFromSchema(numberSchema))
console.log(mockFromSchema(boolSchema))
console.log(mockFromSchema(arrSchema))
console.log(mockFromSchema(objSchema))
