import axios from 'axios'
import { compile, renderFile, templates } from 'eta'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { DataSourceConfig, DataSourcePlugin } from '../../config'
import { addWarnMessages, formatFileContent, generateCommonFiles, trimKey } from '../../generator'
import { YAPIDocument } from './yapi.types'
export interface YAPIDataSourceOptions {
  apiUrl: string
  projectId: number
  token: string
  /**
   * 自定义请求头内容
   */
  headers: Record<string, string | number | boolean>
}

templates.define(
  'yapi.args',
  compile(readFileSync(resolve(__dirname, './partials/api.args.eta'), 'utf-8'))
)

templates.define(
  'yapi.comment',
  compile(readFileSync(resolve(__dirname, './partials/yapi.comment.eta'), 'utf-8'))
)

export const yapiPlugin: DataSourcePlugin<YAPIDocument, YAPIDataSourceOptions> = {
  name: 'yapi',
  async onFetchOriginData(config: DataSourceConfig<YAPIDataSourceOptions>) {
    const pluginConfig = config.dataSourceOptions[this.name]
    const { status, data } = await axios.get('/api/plugin/export', {
      baseURL: pluginConfig.apiUrl,
      timeout: 60000,
      headers: pluginConfig.headers,
      params: {
        token: pluginConfig.token,
        pid: pluginConfig.projectId,
        type: 'json',
        status: 'all',
        isWiki: 'false'
      }
    })
    if (status < 300 && status >= 200) {
      if (data.errcode) {
        throw new Error(`${data.errcode}: ${data.errmsg}`)
      }
      return data as YAPIDocument
    }
    return null
  },
  async onRenderTemplate(config, data) {
    const files: {
      fileName: string
      content: string
    }[] = []
    files.push(...(await generateCommonFiles()))
    // index
    files.push({
      fileName: 'index.ts',
      content: formatFileContent(
        (await renderFile(resolve(__dirname, './templates/index.ts.eta'), {
          apis: data.map(group => ({
            ...group,
            list: group.list.map(api => {
              try {
                return {
                  ...api,
                  res_body: api.res_body ? JSON.parse(api.res_body as string) : {}
                }
              } catch (error) {
                console.error(api.res_body)
              }
            })
          })),
          trimKey,
          addWarnMessages
        })) as string
      )
    })
    return files
  }
}
// formatFileContent
