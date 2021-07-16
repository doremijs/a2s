export interface DataSourcePlugin<DataSourceDocument = unknown, PluginConfig = unknown> {
  name: string
  // lifetimes
  onFetchOriginData?: (config: DataSourceConfig<PluginConfig>) => Promise<DataSourceDocument | null>
  onRenderTemplate?: (
    config: DataSourceConfig<PluginConfig>,
    data: DataSourceDocument
  ) => Promise<
    {
      fileName: string
      content: string
    }[]
  >
}

export interface DataSourceConfig<DataSourceOptions = unknown> {
  plugins?: DataSourcePlugin<unknown, unknown>[]
  type: string
  dataSourceOptions: Record<string, DataSourceOptions>
  requestAdapter: 'axios' | 'taro' | null
  outputPath: string
  overwrite: boolean
  trim?: boolean
  ignoreFiles?: string[]
  hasFormData?: boolean
}
