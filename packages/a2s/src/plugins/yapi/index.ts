import axios from 'axios'
import { renderFile } from 'eta'
import { resolve } from 'path'
import { DataSourceConfig, DataSourcePlugin } from '../../config'
import { formatFileContent } from '../../generator'
import { YAPIDocument, YAPIReqParam, YAPIReqQuery } from './yapi.types'

export interface YAPIDataSourceOptions {
  apiUrl: string
  projectId: number
  token: string
  saveJson?: boolean
}

const yapiPlugin: DataSourcePlugin<YAPIDocument, YAPIDataSourceOptions> = {
  name: 'yapi',
  async onFetchOriginData(config: DataSourceConfig<YAPIDataSourceOptions>) {
    const pluginConfig = config.dataSourceOptions[this.name]
    const { status, data } = await axios.get('api/plugin/export', {
      baseURL: pluginConfig.apiUrl,
      timeout: 60000,
      headers: {},
      params: {
        token: pluginConfig.token,
        pid: pluginConfig.projectId,
        type: 'json',
        status: 'all',
        isWiki: 'false'
      }
    })
    if (status < 300 && status >= 200) {
      return data as YAPIDocument
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
    // index
    files.push({
      fileName: 'index.ts',
      content: formatFileContent(
        (await renderFile(resolve(__dirname, './templates/index.ts.eta'), {
          apis: data,
          extractParameters(parameters: (YAPIReqQuery | YAPIReqParam)[]) {
            const queryList: YAPIReqQuery[] = []
            const pathList: YAPIReqParam[] = []
            // parameters.forEach(parameter => {
            //   queryList.push(parameter)
            //   pathList.push(parameter)
            // })
            return { queryList, pathList }
          }
        })) as string
      )
    })
    return files
  }
}

export default yapiPlugin
