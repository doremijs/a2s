import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import { MockjsRandom, Random } from 'mockjs'

type CustomAddtionalFields =
  | (
      | {
          type: 'integer' | 'number'
          format: /** 随机的自然数 */
          | 'natural'
            /** 随机的整数 */
            | 'integer'
            /** 随机的浮点数 */
            | 'float'
        }
      | {
          type: 'boolean'
        }
      | {
          type: 'string'
          format: /** 随机字符 */
          | 'character'
            /** 随机字符串 */
            | 'string'
            /** 文本 */
            | 'paragraph'
            /** 中文文本 */
            | 'cparagraph'
            /** 随机生成一个句子，第一个单词的首字母大写 */
            | 'sentence'
            /** 随机生成一段中文文本 */
            | 'csentence'
            /** 随机生成一个单词 */
            | 'word'
            /** 随机生成一个汉字 */
            | 'cword'
            /** 随机生成一句标题，其中每个单词的首字母大写 */
            | 'title'
            /** 随机生成一句中文标题 */
            | 'ctitle'
            /** 随机生成常见的英文名 */
            | 'first'
            /** 随机生成一个常见的英文姓 */
            | 'last'
            /** 随机生成一个常见的英文姓名 */
            | 'name'
            /** 随机生成一个常见的中文名 */
            | 'cfirst'
            /** 随机生成一个常见的中文姓 */
            | 'clast'
            /** 随机生成一个常见的中文姓名 */
            | 'cname'
            /** 随机生成一个大区 华北 华东等 */
            | 'region'
            /** 随机生成一个省 */
            | 'province'
            /** 随机生成一个市 */
            | 'city'
            /** 随机生成一个县 */
            | 'county'
            /** 随机生成一个详细地址 */
            | 'address'
            /** 随机生成一个URL */
            | 'url'
            /** 随机生成一个身份证号 */
            | 'idCard'
            /** 随机生成一个guid */
            | 'guid'
            /** 从给定值中随机选择一个 */
            | 'pick'
        }
      | {
          type: 'date'
          /** yyyy-MM-dd HH:mm:ss */
          format: string
        }
      | {
          type: 'image'
          /** 200*300 */
          format: string
        }
    )
  | {
      type: 'array'
    }
  | ({
      type: 'object'
    } & {
      mockArgs?: (string | number | boolean)[]
    })

export type CustomJSONSchema = JSONSchema4 &
  Partial<CustomAddtionalFields> & {
    additionalItems?: boolean | CustomJSONSchema
    items?: CustomJSONSchema | CustomJSONSchema[]
    additionalProperties?: boolean | CustomJSONSchema
    definitions?: {
      [k: string]: CustomJSONSchema
    }
    properties?: {
      [k: string]: CustomJSONSchema
    }
    patternProperties?: {
      [k: string]: CustomJSONSchema
    }
    dependencies?: {
      [k: string]: CustomJSONSchema | string[]
    }
    allOf?: CustomJSONSchema[]
    anyOf?: CustomJSONSchema[]
    oneOf?: CustomJSONSchema[]
  }

/**
 * 根据json schema生成mock数据
 */
export default function mockFromSchema(schema: CustomJSONSchema): JSONSchema4Type {
  return generateOne(schema)
}

function commonMockWithArgs(mockFunc: keyof MockjsRandom, schema: CustomJSONSchema) {
  if (schema.mockArgs !== undefined) {
    return Random[mockFunc](...schema.mockArgs)
  }
  if (schema.minimum !== undefined && schema.minimum !== null) {
    if (schema.maximum !== undefined && schema.maximum !== null) {
      return Random[mockFunc](schema.minimum, schema.maximum)
    }
    return Random[mockFunc](schema.minimum)
  }
  return Random[mockFunc]()
}

function generateOne(schema: CustomJSONSchema): JSONSchema4Type {
  switch (schema.type) {
    case 'integer':
    case 'number':
      return commonMockWithArgs(schema.format ?? 'integer', schema)
    case 'boolean':
      return commonMockWithArgs('boolean', schema)
    case 'string':
      return commonMockWithArgs(schema.format ?? 'string', schema)
    case 'array':
      return Array.from(
        { length: getRandomNumInRange(schema.minItems ?? 2, schema.maxItems ?? 10) },
        () => {
          return generateOne(
            Array.isArray(schema.items)
              ? (schema.items[0] as CustomJSONSchema)
              : (schema.items as CustomJSONSchema)
          )
        }
      )
    case 'object':
      return Object.keys(schema.properties ?? {}).reduce<Record<string, JSONSchema4Type>>(
        (obj, key) => {
          obj[key] = generateOne(schema.properties[key])
          return obj
        },
        {}
      )
    default:
      return Random.string(undefined, 4, 8)
  }
}

function getRandomNumInRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min
}
