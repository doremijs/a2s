import { existsSync } from 'fs-extra'
import { DataSourceConfig } from '.'
import { configFileName, configFilePath } from '../generator'

/**
 * Load config file
 */
let dsConfig: DataSourceConfig
export function loadConfig() {
  if (dsConfig) {
    return dsConfig
  }
  try {
    if (!existsSync(configFilePath)) {
      console.error(`${configFileName} file not exists. Please run 'a2s init' first.`)
      process.exit(-1)
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(configFilePath)
    if (config?.dataSourceOptions) {
      config.outputPath = config.outputPath ?? 'src/api'
      dsConfig = config
      return config as DataSourceConfig
    }
    console.error(`${configFileName} config file format error.`)
    process.exit(-1)
  } catch (error) {
    console.error(`${configFileName} config file load error.`)
    console.error(error)
    process.exit(-1)
  }
}
