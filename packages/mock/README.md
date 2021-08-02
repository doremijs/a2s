# mock
提供数据模拟函数集

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/branches-77.78%25-red.svg) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg) |

## 功能
- 基于 `JSON Schema` 的数据模拟
- 各种实用模拟函数库 `mockIp` `mockRequestLogs` `mockEchartsOption`等
- 批量模拟函数 `bulkMock`

## 函数说明
1. 基于标准的`JSON Schema`格式的数据进行mock，例如
  ```ts
  import { mockFromSchema } from '@zidong/mock'

  mockFromSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      gender: {
        type: 'string'
      },
      age: {
        type: 'number'
      },
      children: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            gender: {
              type: 'string'
            },
            age: {
              type: 'number'
            }
          }
        }
      }
    }
  })
  // will output
  // {
  //   name: 'xxx',
  //   age: xx,
  //   gender: 'xxx',
  //   children: [
  //     {
  //       name: 'xxx',
  //       age: xx,
  //       gender: 'xxx',
  //     },
  //     {
  //       name: 'xxx',
  //       age: xx,
  //       gender: 'xxx',
  //     },
  //     ...
  //   ]
  // }
  ```

  为了让 mock 的数据更好看，针对 JSON Schema 的`type`做了些约束，并使用`minimum`,`maximum`,`minItems`,`maxItems`字段以及新增的`format`和`mockArgs`字段进行数据美化，美化后的传参可以是这样的
  ```ts
  import { mockFromSchema } from '@zidong/mock'

  mockFromSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string',
        // 中文名
        format: 'cname'
      },
      gender: {
        type: 'string',
        // 数组中选择一项
        enum: ['男', '女']
      },
      age: {
        type: 'number',
        // 自然数
        format: 'natural',
        // 最小值
        minimum: 4,
        // 最大值
        maximum: 64
      },
      children: {
        type: 'array',
        // mock的数组最少1个元素，最多3个元素
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
  })
  // will output
  // {
  //   name: '某中文名',
  //   age: 4-64间一个数字,
  //   gender: '男|女',
  //   children: [
  //     {
  //       name: '某中文名',
  //       age: 4-64间一个数字,
  //       gender: '男|女',
  //     },
  //     {
  //       name: '某中文名',
  //       age: 4-64间一个数字,
  //       gender: '男|女',
  //     },
  //     ...
  //   ]
  // }
  ```

2. 批量模拟
  ```ts
  import { bulkMock, mockFromSchema } from '@zidong/mock'

  // 默认批量随机执行 2-4 次
  bulk(mockFromSchema)()

  // 批量随机执行 6-20 次
  bulk(mockFromSchema, 6, 20)({ type: 'number' }) 
  ```

## 测试
```shell
yarn test
```

## 发布
```bash
npm publish --access public
```
