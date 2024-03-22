import { resolve } from 'path'
/**
 * 初始化配置文件
 */
import { renderFile } from 'eta'
import { writeToFile } from '.'

export const configFileName = '.a2s.js'

const configTemplateFilePath = resolve(__dirname, '../templates/.a2s.js.eta')

export const configFilePath = resolve(process.cwd(), configFileName)

/**
 * 生成配置文件
 * @param overwrite 是否覆盖
 */
export async function initConfig(overwrite: boolean) {
  const content = await renderFile(configTemplateFilePath, {})
  await writeToFile(configFilePath, content as string, overwrite, 'Config file already exists, overwrite?')
}
