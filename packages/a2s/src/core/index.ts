import ora from 'ora'
import { resolve } from 'path'
import { DataSourcePlugin, loadConfig } from '../config'
import { writeToFile } from '../generator'
import '../generator/partials'
import { openapiPlugin } from '../plugins'
// import yapiPlugin from '../plugins/yapi'

export async function runGenerate(overwrite: boolean) {
  // 加载配置
  const config = loadConfig()
  // 加载插件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pluginMap: Record<string, DataSourcePlugin<any, any>> = {}
  pluginMap[openapiPlugin.name] = openapiPlugin
  // pluginMap[yapiPlugin.name] = yapiPlugin
  if (config.plugins?.length) {
    config.plugins.forEach(plugin => {
      pluginMap[plugin.name] = plugin
    })
  }
  // 当前只支持单个配置
  const type = Object.keys(config.dataSourceOptions)[0]
  const currentPlugin = pluginMap[type]
  const spinner = ora({ text: `Fetching ${type} configs...`, spinner: 'bouncingBar' }).start()
  let apiDoc: unknown
  try {
    // 加载api数据
    apiDoc = await currentPlugin.onFetchOriginData?.(config)
    if (!apiDoc) {
      console.error('获取Api接口数据为空')
      process.exit(-1)
    }
  } catch (error) {
    console.error('接口数据获取错误\n', error)
    spinner.stop()
    process.exit(-1)
  }
  // 渲染模板
  let files
  try {
    files = await currentPlugin.onRenderTemplate(config, apiDoc)
  } catch (error) {
    console.error('模板渲染错误\n', error)
    spinner.stop()
    process.exit(-1)
  }
  // 生成文件
  const outputFolder = resolve(process.cwd(), config.outputPath)
  for (const file of files) {
    try {
      await writeToFile(resolve(outputFolder, file.fileName), file.content, overwrite)
    } catch (error) {
      console.error(`文件 ${file.fileName} 写入错误\n`, error)
    }
  }
  spinner.stop()
  console.log('Done!')
}
