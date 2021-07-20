import axios from 'axios'
import { compile, renderFile, templates } from 'eta'
import { readFileSync } from 'fs'
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

// re-define schema.array
templates.define(
  'schema.array',
  compile(readFileSync(resolve(__dirname, './partials/schema.array.eta'), 'utf-8'))
)
// re-define schema.object
templates.define(
  'schema.object',
  compile(readFileSync(resolve(__dirname, './partials/schema.object.eta'), 'utf-8'))
)
// schema.ref
templates.define(
  'schema.ref',
  compile(readFileSync(resolve(__dirname, './partials/schema.ref.eta'), 'utf-8'))
)
templates.define(
  'schema.any',
  compile(readFileSync(resolve(__dirname, './partials/schema.any.eta'), 'utf-8'))
)

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
    // namespace
    files.push({
      fileName: 'a2s.namespace.d.ts',
      content: formatFileContent(
        (await renderFile(
          resolve(__dirname, './templates/a2s.namespace.d.ts.eta'),
          data.components
        )) as string
      )
    })
    // index
    files.push({
      fileName: 'index.ts',
      content: formatFileContent(
        (await renderFile(resolve(__dirname, './templates/index.ts.eta'), {
          // tags: data.tags,
          components: data.components,
          paths: data.paths,
          extractParameters(parameters: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]) {
            const pathList: OpenAPIV3.ParameterObject[] = []
            const queryList: OpenAPIV3.ParameterObject[] = []
            parameters.forEach(parameter => {
              let _parameter: OpenAPIV3.ParameterObject
              if ('$ref' in parameter) {
                const splited = parameter['$ref'].split('/')
                const ref = data.components.parameters[splited[splited.length - 1]]
                _parameter = ref as OpenAPIV3.ParameterObject
              } else {
                _parameter = parameter
              }
              if (_parameter.in === 'path') {
                pathList.push(_parameter)
              } else if (_parameter.in === 'query') {
                queryList.push(_parameter)
              }
            })
            return { queryList, pathList }
          }
        })) as string
      )
    })
    return files
  }
}

export default openapiPlugin
