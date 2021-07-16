/* eslint-disable */
/** @type {import('@zidong/a2s/dist/types').DataSourceConfig} */
module.exports = {
  // 数据源类型
  dataSourceOptions: {
    /** @type {import('@zidong/a2s/types').OpenApiDataSourceConfig} */
    openapi: {
      // 数据源地址
      apiUrl: 'https://admin.ainanjing.org.cn/apis-json',
      basicAuth: '',
      saveJson: true
    }
  },
  // type: 'yapi',
  // dataSourceOptions: {
  //   'yapi': {
  //     apiUrl: 'https://your.company.com/',
  //     projectId: 1,
  //     token: 'xxx',
  //     saveJson: true
  //   }
  // },
  // [Optional, default: 'axios'] 基于什么框架去生成代码
  requestAdapter: 'axios',
  // 生成的service相关文件的存储位置
  outputPath: 'src/services',
  // 是否覆盖固定生成的几个文件？一般不建议取消，保持文件最新
  overwrite: true,
  // [Optional, default: true] 是否对api的分组名和名称进行trim，减少空格
  trim: true,
  // [Optional, default: []] 生成时可忽略的文件集合
  // eg: ['yapi.services.ts']
  ignoreFiles: [],
  // [Optional, default: true] 是否使用FormData，小程序不需要
  hasFormData: true,
  // [Optional, default: null] 解构response返回的数据层级，一般用于后端返回的数据有一层固定的包裹，比如 { data: {}, message: '', err_code: '' } 这种情况，此时设置为 'data' 将自动解构到 data 里面的具体数据，如果有多层包裹，请使用数组
  dataPath: null
}
