import { existsSync } from 'fs-extra'
import { DataSourceConfig } from '.'
import { configFilePath } from '../generator/init'

/**
 * 加载配置文件
 */
let dsConfig: DataSourceConfig
export function loadConfig() {
  if (dsConfig) {
    return dsConfig
  }
  try {
    if (!existsSync(configFilePath)) {
      console.error('.a2s.js文件不存在，请先创建，或者使用a2s init命令生成')
      process.exit(-1)
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(configFilePath)
    if (config && config.dataSourceOptions) {
      config.outputPath = config.outputPath ?? 'src/services'
      return config as DataSourceConfig
    }
    console.error('.a2s.js文件配置有误')
    process.exit(-1)
  } catch (error) {
    console.error('.a2s.js文件读取错误，请检查配置')
    console.error(error)
    process.exit(-1)
  }
}
