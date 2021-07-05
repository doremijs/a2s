/**
 * 数据源配置
 */
export type DataSourceConfig = (YAPISourceConfig | OpenAPISourceConfig) & {
  // 基于axios还是Taro小程序去生成请求主文件
  generateBaseOn?: 'axios' | 'taro'
  // 生成的service相关文件的存储位置
  outputPath: string
  // 是否保存api.json文件
  saveJson?: boolean
  // 是否覆盖固定生成的几个文件？一般不建议取消，保持文件最新
  overwrite?: boolean
  // 是否对api的分组名和名称进行trim
  trim?: boolean
  // 生成时可忽略的文件集合
  ignoreFiles: string[]
  // 是否使用FormData
  hasFormData?: boolean
  // 解构response返回的数据层级
  dataPath?: null | string | string[]
}

/**
 * YAPI数据源配置
 */
export interface YAPISourceConfig {
  type: 'yapi'
  // yapi地址前缀
  apiPrefix: string
  // yapi的项目token
  token: string
  // yapi的项目id
  projectId: number
}

/**
 * OpenAPI数据源配置
 */
export interface OpenAPISourceConfig {
  type: 'openapi'
  // OpenAPI数据源地址
  apiPrefix: string
}
