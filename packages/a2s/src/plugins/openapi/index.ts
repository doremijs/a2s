import axios from 'axios'
import { renderFile } from 'eta'
import { OpenAPIV3 } from 'openapi-types'
import { resolve } from 'path'
import { DataSourceConfig, DataSourcePlugin } from '../../config'
import { formatFileContent } from '../../generator'

export interface OpenAPIDataSourceOptions {
  apiUrl: string
  saveJson?: boolean
  basicAuth?: {
    username: string
    password: string
  }
}

const openapiPlugin: DataSourcePlugin<OpenAPIV3.Document, OpenAPIDataSourceOptions> = {
  name: 'openapi',
  async onFetchOriginData(config: DataSourceConfig<OpenAPIDataSourceOptions>) {
    const pluginConfig = config.dataSourceOptions[this.name]
    const { status, data } = await axios.get(pluginConfig.apiUrl, {
      responseType: 'json',
      timeout: 60000,
      headers: pluginConfig.basicAuth
        ? {
            Authorization: Buffer.from(
              `${pluginConfig.basicAuth.username}:${pluginConfig.basicAuth.password}`
            ).toString('base64')
          }
        : {}
    })
    if (status < 300 && status >= 200) {
      return data as OpenAPIV3.Document
    }
    return null
  },
  async onRenderTemplate(config, data) {
    const files: {
      fileName: string
      content: string
    }[] = []
    if (config.dataSourceOptions[this.name].saveJson) {
      files.push({
        fileName: 'a2s.apis.json',
        content: JSON.stringify(data, null, 2)
      })
    }
    // types
    files.push({
      fileName: 'a2s.types.ts',
      content: formatFileContent(
        (await renderFile(resolve(__dirname, './templates/a2s.types.ts.eta'), null)) as string
      )
    })
    // adapter
    files.push({
      fileName: 'a2s.adapter.ts',
      content: formatFileContent(
        (await renderFile(
          resolve(__dirname, './templates/a2s.adapter.axios.ts.eta'),
          null
        )) as string
      )
    })
    // // index
    files.push({
      fileName: 'index.ts',
      content: formatFileContent(
        (await renderFile(resolve(__dirname, './templates/index.ts.eta'), {
          // tags: data.tags,
          components: data.components,
          paths: data.paths
        })) as string
      )
    })
    return files
  }
}

export default openapiPlugin
