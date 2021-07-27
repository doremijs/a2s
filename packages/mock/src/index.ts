export * from './advanced'
export * from './schema'

export function bulkMock<Args, Return>(
  func: (args: Args) => Return,
  minimum?: number,
  maximum?: number
): (args: Args) => Return[] {
  return () => []
}
