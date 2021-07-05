/**
 * 初始化配置文件
 */
import { renderFile } from 'eta'
import { resolve } from 'path'
import { writeToFile } from '../utils/file'

const configTemplateFilePath = resolve(__dirname, '../templates/.ds.js.eta')

export const configFilePath = resolve(process.cwd(), '.ds.js')

export default async function initConfig(overwrite: boolean) {
  const content = await renderFile(configTemplateFilePath, {})
  writeToFile(configFilePath, content as string, '配置文件已存在，是否覆盖？', overwrite)
}
