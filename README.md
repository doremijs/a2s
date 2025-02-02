# a2s
根据Api文档定义生成前端调用代码，支持 openapi(swagger) 和 yapi。
目标是对[y2s](https://www.npmjs.com/package/y2s)做一次升级以支持更多的api文档，用法和`y2s`基本一致。

## 版本历史
- 0.0.21
  - 兼容 OpenAPI 的接口中 Response 的 ContentType 为 `*/*` 的情况
- 0.0.20
  - 修复 AllOf/AnyOf 生成的数组[]在新一行导致无法格式化的问题
- 0.0.19
  - 修复 OpenAPI 规范中请求body直接是 `$ref` 而没有content的兼容问题
- 0.0.18
  - 修复 swagger 中 schema path 中存在`.`特殊符号导致生成错误的问题
- 0.0.17
  - YAPI 请求添加 headers 参数
- 0.0.15
  - 添加 swagger 2.0 规范支持，通过一个`openapi.isVersion2`参数支持
- 0.0.13
  - ts 类型优化
- 0.0.9
  - 升级依赖版本并修复`prettier`的一个配置警告
  - 修复`axios`没有进行`try-catch`的拦截错误
  - 优化`GET`请求下没有`query`参数时参数全部进入`body`的问题
- 0.0.8
  - 修复`a2s.apis.json`文件生成时机不对的问题
  - 修复`type=array`时没有提供`items`导致生成报错的问题
- 0.0.7
  - 添加`ServiceKeys`,`ServiceArg`和`ServiceReturn`辅助类型
  - 生成的`unknown`类型换成`any`类型
- 0.0.6
  - 修复yapi生成的body参数为空的问题
  - 修复`a2s.apis.json`文件无法更新的问题
  - 修复生成的模板文件中url替换错误的问题
- 0.0.5
  - 修复yapi生成的args类型错误问题
- 0.0.4
  - 支持yapi的代码生成
- 0.0.3
  - 修复不带`-y`时进程无法结束的问题
  - 修复`loadConfig`的逻辑错误
  - 完善readme
- 0.0.2
  - 修复打包发布丢失模板文件问题
## 安装
```sh
# yarn
yarn add -D @doremijs/a2s
# or npm
npm i --save-dev @doremijs/a2s
# or yarn global
yarn global add @doremijs/a2s
# or npm global
npm i -g @doremijs/a2s
```

## 初始化配置文件
```sh
# 打印帮助信息
a2s help
# 在当前目录生成一个.a2s.js的配置文件
a2s init
```

配置文件生成后需要根据自己项目使用的api文档修改`.a2s.js`文件中的配置项。

## 配置项
```js
/** @type {import('@doremijs/a2s/dist/types').DataSourceConfig} */
module.exports = {
  // 自定义插件
  plugins: [/** require('a2s-custom-plugin') */],
  // 数据源类型
  dataSourceOptions: {
    // key支持openapi和yapi以及插件额外支持的name值，值为具体每个插件的参数
    /** @type {import('@doremijs/a2s/types').OpenApiDataSourceConfig} */
    openapi: {
      // 数据源地址
      apiUrl: 'http://api.your.company/apis-json',
      // basicAuth: {
      //   username: '',
      //   password: ''
      // },
      // headers: {},
    }
  },
  // type: 'yapi',
  // dataSourceOptions: {
  //   'yapi': {
  //     apiUrl: 'https://your.company.com/',
  //     projectId: 1,
  //     token: 'xxx'
  //   }
  // },
  // [Optional, default: 'axios'] 基于什么框架去生成代码，目前支持axios和taro
  requestAdapter: 'axios',
  // 生成的service相关文件的存储位置
  outputPath: 'src/services',
  // 是否覆盖固定生成的几个文件？一般不建议取消，保持文件最新
  overwrite: true,
  // [Optional, default: true] 是否对api的分组名和名称进行trim，减少空格
  trim: true,
  // [Optional, default: ['a2s.adapter.ts']] 生成时可忽略的文件集合，当 a2s.adapter.ts 文件根据业务发生变更后需要ignore
  // eg: ['a2s.adapter.ts']
  ignoreFiles: ['a2s.adapter.ts'],
  // [Optional, default: null] 解构response返回的数据层级，一般用于后端返回的数据有一层固定的包裹，比如 { data: {}, message: '', err_code: '' } 这种情况，此时设置为 'data' 将自动解构到 data 里面的具体数据，如果有多层包裹，请使用数组
  dataPath: null
}
```

## 代码生成
```sh
# 该命令将会在'.a2s.js'配置中的'outputPath'目录下生成api的相关文件
a2s generate [-y]
```

## 根据业务修改适配器代码
默认会根据配置中的`requestAdapter`的配置（默认为`axios`）生成适配器代码`a2s.adapter.ts`。
这部分代码需要根据实际业务做相应修改，然后将该文件加入`ignoreFile`（默认已加入），避免下次生成时覆盖掉该文件。

## api用法
```ts
import services from '@/services'

async function doRequest() {
  const { error, data } = await services['group@api_title']({ ...args }, extraParams)
  return error ? [] : data.items
}
```

## 截图
直接套用`y2s`的截图，效果是一致的（OpenApi会有interface的类型）
- 请求参数提示

![](https://raw.githubusercontent.com/erguotou520/yapi2service/HEAD/docs/args.png)
- 请求结果提示

![](https://raw.githubusercontent.com/erguotou520/yapi2service/HEAD/docs/resp.png)

## 发布
```bash
npm publish
```

## 淘宝源主动更新
https://npm.taobao.org/sync/@doremijs/a2s

## 开发

```sh
pnpm install
pnpm setup
```