import { GenerateFiles } from '../generator'

export interface DataSourcePlugin<DataSourceDocument = unknown, PluginConfig = unknown> {
  /**
   * 插件名
   */
  name: string
  /**
   * 获取api数据方法
   */
  onFetchOriginData: (config: DataSourceConfig<PluginConfig>) => Promise<DataSourceDocument | null>
  /**
   * 生成模板文件列表方法
   */
  onRenderTemplate: (
    config: DataSourceConfig<PluginConfig>,
    data: DataSourceDocument
  ) => Promise<GenerateFiles>
}

export interface DataSourceConfig<DataSourceOptions = unknown> {
  /**
   * 自定义插件
   */
  plugins?: DataSourcePlugin<unknown, unknown>[]
  /**
   * 插件参数
   */
  dataSourceOptions: Record<string, DataSourceOptions>
  /**
   * 生成的service相关文件的存储位置
   */
  outputPath: string
  /**
   * 是否覆盖固定生成的几个文件？一般不建议取消，保持文件最新
   */
  overwrite: boolean
  /**
   * 是否对api的分组名和名称进行trim
   */
  trim?: boolean
  /**
   * 生成时可忽略的文件集合
   */
  ignoreFiles?: string[]
  // hasFormData?: boolean
  /**
   * 解构response返回的数据层级
   */
  dataPath?: null | string | string[]
}
