/**
 * 加载数据源并生成代码
 */
import { parseArgs } from './args'
import init from './generator/init'

async function run() {
  const [_module, service, args] = parseArgs(process.argv)
  if (_module === 'request') {
    // 是否有覆写参数
    const overwrite = args.includes('-y')
    if (service === 'init') {
      init(overwrite)
    } else if (service === 'generate') {
      generate(overwrite)
    }
  }
}

run()
