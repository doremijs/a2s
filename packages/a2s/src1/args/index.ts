// import minimist, { ParsedArgs } from 'minimist'

import { usageString } from './help'

type DCService = 'init' | 'help' | 'generate'
const services = ['init', 'help', 'generate']

export function parseArgs(_args: string[]): [DCService, string[]] {
  // 空命令
  if (!_args.length) {
    console.error(usageString)
    process.exit(-1)
  }
  // 服务
  const service = _args[0]
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
  return [service as DCService, _args.slice(1)]
}
