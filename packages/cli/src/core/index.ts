import ora from 'ora'
import { resolve } from 'path'
import { DataSourcePlugin, loadConfig } from '../config'
import { GenerateFiles, writeToFile } from '../generator'
import '../generator/partials'
import { openapiPlugin, yapiPlugin } from '../plugins'

export async function runGenerate(overwrite: boolean) {
  // 加载配置
  const config = loadConfig()
  // 加载插件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pluginMap: Record<string, DataSourcePlugin<any, any>> = {}
  pluginMap[openapiPlugin.name] = openapiPlugin
  pluginMap[yapiPlugin.name] = yapiPlugin
  if (config.plugins?.length) {
    for (const plugin of config.plugins) {
      pluginMap[plugin.name] = plugin
    }
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
      console.error('API data is empty')
      process.exit(-1)
    } else {
      // 保存获取到的api数据
      await writeToFile(
        resolve(process.cwd(), 'node_modules/.a2s/a2s.apis.json'),
        JSON.stringify(apiDoc, null, 2),
        true
      )
    }
  } catch (error) {
    console.error('Error when fetching\n', error)
    spinner.stop()
    process.exit(-1)
  }
  spinner.stop()
  // 渲染模板
  let files: GenerateFiles
  try {
    files = await currentPlugin.onRenderTemplate(config, apiDoc)
  } catch (error) {
    console.error('Error when rendering template\n', error)
    spinner.stop()
    process.exit(-1)
  }
  // 生成文件
  const outputFolder = resolve(process.cwd(), config.outputPath)
  for (const file of files) {
    try {
      await writeToFile(
        resolve(outputFolder, file.fileName),
        file.content,
        file.forceOverwrite ?? overwrite
      )
    } catch (error) {
      console.error(`Error when write to file ${file.fileName}\n`, error)
    }
  }
  console.log('Done!')
}
