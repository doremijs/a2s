// import minimist, { ParsedArgs } from 'minimist'

import { usageString } from './help'

type DCModule = 'request'
const modules = ['request']
type DCService = 'init' | 'help' | 'generate'
const services = ['init', 'help', 'generate']

export function parseArgs(_args: string[]): [DCModule, DCService, string[]] {
  // 空命令
  if (!_args.length) {
    console.error(usageString)
    process.exit(-1)
  }
  // 模块
  const _module = _args[0]
  if (!modules.includes(_module)) {
    console.warn('不支持的模块')
    console.error(usageString)
    process.exit(-1)
  }
  // 服务
  const service = _args[1]
  if (!services.includes(service)) {
    console.warn('不支持的服务')
    console.error(usageString)
    process.exit(-1)
  }
  // help
  if (service === 'help') {
    console.error(usageString)
    process.exit(0)
  }
  return [_module as DCModule, service as DCService, _args.slice(1)]
}
