/**
 * 加载数据源并生成代码
 */
import { parseArgs } from './args'
import { runGenerate } from './core'
import { initConfig } from './generator'

export async function run(_args: string[]) {
  const [service, args] = parseArgs(_args)
  // 是否有覆写参数
  const overwrite = args.includes('-y')
  // 初始化配置文件
  if (service === 'init') {
    initConfig(overwrite)
  } else if (service === 'generate') {
    // 生成api请求代码
    runGenerate(overwrite)
  }
}
