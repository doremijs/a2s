import { render } from 'eta'
import fs from 'fs'
import { resolve } from 'path'
import { loadConfig } from '../loader'
import { formatFileContent, writeToFile } from './file'

export async function renderTemplateAndWriteToFile(
  templateName: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: object,
  overwrite = false,
  targetFileName?: string
) {
  const config = loadConfig()
  const templateFile = resolve(__dirname, `../templates/${templateName}.eta`)
  const renderStr = await render(
    await fs.promises.readFile(templateFile, { encoding: 'utf-8' }),
    data
  )
  const targetFilePath = resolve(process.cwd(), config.outputPath, targetFileName || templateName)
  await writeToFile(
    targetFilePath,
    formatFileContent(renderStr as string),
    `文件 ${templateName} 已存在，是否覆盖？`,
    overwrite
  )
}
