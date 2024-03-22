import { usageString } from './help'

type SubCommand = 'init' | 'help' | 'generate'
const subcommands = ['init', 'help', 'generate']

export function parseArgs(_args: string[]): [SubCommand, string[]] {
  // empty args
  if (!_args.length) {
    console.error(usageString)
    process.exit(-1)
  }
  // subcommand
  const subcommand = _args[0]
  if (!subcommands.includes(subcommand)) {
    console.warn('Unsupported subcommand.')
    console.error(usageString)
    process.exit(-1)
  }
  // help
  if (subcommand === 'help') {
    console.error(usageString)
    process.exit(0)
  }
  return [subcommand as SubCommand, _args.slice(1)]
}
