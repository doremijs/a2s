import { existsSync } from 'fs-extra'
import { configFilePath } from '../generator/init'
import { DataSourceConfig } from '../types/config'
import { isObject, isString } from '../utils'

export * from './convert'

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
    if (isObject(config) && isString(config.type) && isString(config.apiPrefix)) {
      config.outputPath = config.outputPath ?? 'src/services'
      return config as DataSourceConfig
    }
  } catch (error) {
    console.error('.a2s.js文件读取错误，请检查配置')
    console.error(error)
    process.exit(-1)
  }
  return null
}
