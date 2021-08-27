import { mockUrl } from './advanced'

export * from './advanced'
export * from './bulk'
export * from './schema'

export function bulkMock<Args, Return>(
  func: (args: Args) => Return,
  minimum?: number,
  maximum?: number
): (args: Args) => Return[] {
  return () => []
}

console.log(JSON.stringify(mockUrl({ type: 'text' }), null, 2))
