import { OpenAPIV3 } from 'openapi-types'
import { convertOpenAPIToYAPI, convertYAPIToRenderData, loadConfig } from '../loader'
import { YAPIDocument } from '../types'
import { fetchJson, renderTemplateAndWriteToFile } from '../utils'

/**
 * 根据配置加载数据源的数据
 */
export async function generate(overwrite: boolean): Promise<void> {
  // 加载配置
  const config = loadConfig()
  // 下载json
  const json = await fetchJson(config)
  let yapiDocument: YAPIDocument
  // 转成通用json
  if (config.type === 'openapi') {
    yapiDocument = convertOpenAPIToYAPI(json as OpenAPIV3.Document)
  } else {
    yapiDocument = json as YAPIDocument
  }
  // 转化成渲染所需结构
  const apis = convertYAPIToRenderData(yapiDocument)
  // 渲染模板
  await renderTemplateAndWriteToFile('a2s.apis.ts', { apis }, overwrite)
  await renderTemplateAndWriteToFile('a2s.request.d.ts', null, overwrite)
  await renderTemplateAndWriteToFile('a2s.service.keys.d.ts', { apis }, overwrite)
  await renderTemplateAndWriteToFile('a2s.service.ts', null, overwrite)
  if (config.generateBaseOn === 'axios') {
    await renderTemplateAndWriteToFile('index.axios.ts', null, overwrite, 'index.ts')
  } else if (config.generateBaseOn === 'taro') {
    await renderTemplateAndWriteToFile('index.taro.ts', null, overwrite, 'index.ts')
  }
  // 写文件
  // 结束
}
