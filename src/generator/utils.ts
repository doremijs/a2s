import { renderFile } from 'eta'
import { resolve } from 'path'
import { formatFileContent } from '.'
import { loadConfig } from '../config'
import { GenerateFiles } from './types'

/**
 * 去掉字符串中所有空格
 * @param str 字符串
 * @returns 去掉空格后的字符串
 */
export function trimKey(str: string) {
  const config = loadConfig()
  if (config.trim) {
    return str.replace(/ /g, '')
  }
  return str
}

/**
 * 修复key中一些错误的字符，兼容特殊的API场景
 * @param key 对象的键
 */
export function fixKey(key: string) {
  return key.replace(/[.]/g, '_')
}

/**
 * 延迟展示警告文字，避免破坏ora输出
 * @param str 字符串
 */
export function addWarnMessages(str: string) {
  setTimeout(() => {
    console.warn(str)
  }, 10)
}

/**
 * 获取通用的生成文件集合
 * @param data 原始api数据
 * @returns 待生成的文件集合
 */
export async function generateCommonFiles(): Promise<GenerateFiles> {
  const files: GenerateFiles = []
  const config = loadConfig()
  // types
  files.push({
    fileName: 'a2s.types.ts',
    content: formatFileContent(
      (await renderFile(resolve(__dirname, '../templates/a2s.types.ts.eta'), {})) as string
    )
  })
  // utils
  files.push({
    fileName: 'a2s.utils.ts',
    content: formatFileContent(
      (await renderFile(resolve(__dirname, '../templates/a2s.utils.ts.eta'), {})) as string
    )
  })
  // adapter
  files.push({
    fileName: 'a2s.adapter.ts',
    content: formatFileContent(
      (await renderFile(
        resolve(__dirname, `../templates/a2s.adapter.${config.requestAdapter}.ts.eta`),
        {
          dataPath: config.dataPath
            ? Array.isArray(config.dataPath)
              ? config.dataPath
              : [config.dataPath]
            : null
        }
      )) as string
    )
  })
  return files
}
