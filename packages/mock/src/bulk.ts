import { Random } from 'mockjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function bulkMock<SingleMockFunction extends (...args: any) => any>(
  func: SingleMockFunction,
  minimum = 1,
  maximum = 4
): (...args: Parameters<SingleMockFunction>) => ReturnType<SingleMockFunction>[] {
  return (...args: Parameters<SingleMockFunction>) => {
    const count = Random.natural(minimum, maximum)
    return Array(count)
      .fill('')
      .map(() => func(...args))
  }
}
