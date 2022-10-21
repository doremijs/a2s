import axios from 'axios'
import { compile, renderFile, templates } from 'eta'
import { readFileSync } from 'fs'
import { OpenAPIV3 } from 'openapi-types'
import { resolve } from 'path'
import swaggerConvert from 'swagger2openapi'
import { DataSourceConfig, DataSourcePlugin } from '../../config'
import {
  addWarnMessages,
  fixKey,
  formatFileContent,
  generateCommonFiles,
  trimKey
} from '../../generator'

export interface OpenAPIDataSourceOptions {
  /**
   * openapi的json数据地址
   */
  apiUrl: string
  /**
   * 是否是 swagger 2.0 规范
   */
  isVersion2?: boolean
  /**
   * 如果openapi的数据获取外层有basic auth验证时使用
   */
  basicAuth?: {
    username: string
    password: string
  }
  /**
   * 自定义请求头内容
   */
  headers: Record<string, string | number | boolean>
}

templates.define(
  'openapi.schemas',
  compile(readFileSync(resolve(__dirname, './partials/components.schemas.eta'), 'utf-8'))
)
templates.define(
  'openapi.responses',
  compile(readFileSync(resolve(__dirname, './partials/components.responses.eta'), 'utf-8'))
)
// templates.define(
//   'openapi.parameters',
//   compile(readFileSync(resolve(__dirname, './partials/components.parameters.eta'), 'utf-8'))
// )
// templates.define(
//   'openapi.requestBodies',
//   compile(readFileSync(resolve(__dirname, './partials/components.requestBodies.eta'), 'utf-8'))
// )

templates.define(
  'openapi.args',
  compile(readFileSync(resolve(__dirname, './partials/api.args.eta'), 'utf-8'))
)

templates.define(
  'openapi.resp',
  compile(readFileSync(resolve(__dirname, './partials/api.response.eta'), 'utf-8'))
)

export const openapiPlugin: DataSourcePlugin<OpenAPIV3.Document, OpenAPIDataSourceOptions> = {
  name: 'openapi',
  async onFetchOriginData(config: DataSourceConfig<OpenAPIDataSourceOptions>) {
    const pluginConfig = config.dataSourceOptions[this.name]
    const { status, data } = await axios.get(pluginConfig.apiUrl, {
      responseType: 'json',
      timeout: 60000,
      auth: pluginConfig.basicAuth,
      headers: pluginConfig.headers
    })
    if (status < 300 && status >= 200) {
      // swagger 2.0 版本用 swagger2openapi 下载
      if (pluginConfig.isVersion2) {
        const ret = await new Promise((resolve, reject) => {
          swaggerConvert.convertObj(data, { patch: true, warnOnly: true }, (error, options) => {
            if (error) {
              reject(error)
            } else {
              resolve(options.openapi)
            }
          })
        })
        return ret as OpenAPIV3.Document
      } else {
        return data as OpenAPIV3.Document
      }
    } else {
      return null
    }
  },
  async onRenderTemplate(config, data) {
    const components = data.components ?? {}
    const files: {
      fileName: string
      content: string
    }[] = []
    files.push(...(await generateCommonFiles()))
    // namespace
    files.push({
      fileName: 'a2s.namespace.d.ts',
      content: formatFileContent(
        (await renderFile(resolve(__dirname, './templates/a2s.namespace.d.ts.eta'), {
          components,
          fixKey
        })) as string
      )
    })
    // index
    files.push({
      fileName: 'index.ts',
      content: formatFileContent(
        (await renderFile(resolve(__dirname, './templates/index.ts.eta'), {
          // tags: data.tags,
          components,
          paths: data.paths,
          trimKey,
          fixKey,
          addWarnMessages,
          /**
           * 将parameters里的请求参数拆分成params和queryList
           * @param parameters openapi.parametes
           * @returns 路径参数集合与query参数集合
           */
          extractParameters(
            parameters: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] = []
          ) {
            const paramList: OpenAPIV3.ParameterObject[] = []
            const queryList: OpenAPIV3.ParameterObject[] = []
            parameters.forEach(parameter => {
              let _parameter: OpenAPIV3.ParameterObject
              if ('$ref' in parameter) {
                const splited = parameter['$ref'].split('/')
                const ref = components.parameters?.[splited[splited.length - 1]]
                _parameter = ref as OpenAPIV3.ParameterObject
              } else {
                _parameter = parameter
              }
              if (_parameter.in === 'path') {
                paramList.push(_parameter)
              } else if (_parameter.in === 'query') {
                queryList.push(_parameter)
              }
            })
            return { queryList, paramList }
          }
        })) as string
      )
    })
    return files
  }
}
