import { writeFileSync } from 'fs'
import { ensureFileSync, existsSync } from 'fs-extra'
import { prompt } from 'inquirer'
import { parse } from 'path'
import { format } from 'prettier'
import { loadConfig } from '../config'

/**
 * 写文件
 * @param filePath 要写文件的路径
 * @param content 要写入的字符串
 * @param overwrite 是否直接覆盖内容
 * @param rewriteMsg 文件已存在时的提示语
 */
export async function writeToFile(
  filePath: string,
  content: string,
  overwrite = false,
  rewriteMsg?: string
): Promise<boolean> {
  const filename = parse(filePath).base
  if (existsSync(filePath)) {
    const config = loadConfig()
    // 判断该文件是否ignore
    if (config?.ignoreFiles?.includes(filename)) {
      return true
    }
    // 是否命令行设置了覆盖模式
    if (overwrite) {
      writeFileSync(filePath, content, {
        encoding: 'utf8'
      })
      return true
    } else {
      const ret = await prompt({
        type: 'confirm',
        name: 'rewrite',
        message: rewriteMsg || `文件${filename}已存在，是否覆盖？`
      })
      if (ret.rewrite) {
        writeFileSync(filePath, content, {
          encoding: 'utf8'
        })
        return true
      }
      return false
    }
  } else {
    ensureFileSync(filePath)
    writeFileSync(filePath, content, {
      encoding: 'utf8'
    })
    return true
  }
}

export function formatFileContent(str: string) {
  return format(str, {
    // 一行最多 100 字符
    printWidth: 100,
    // 使用 2 个空格缩进
    tabWidth: 2,
    // 不使用缩进符，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: false,
    // 使用单引号
    singleQuote: true,
    // 对象的 key 仅在必要时用引号
    quoteProps: 'as-needed',
    // jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    // 末尾不需要逗号
    trailingComma: 'none',
    // 大括号内的首尾需要空格
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    bracketSameLine: false,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'avoid',
    // 每个文件格式化的范围是文件的全部内容
    rangeStart: 0,
    rangeEnd: Infinity,
    // 解析器
    parser: 'babel-ts',
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: 'preserve',
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    // Vue文件script和style标签内不缩进
    vueIndentScriptAndStyle: false,
    // 换行符使用 auto
    endOfLine: 'auto'
  })
}
