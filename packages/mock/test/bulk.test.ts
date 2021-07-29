import { expect, test } from '@jest/globals'
import { bulkMock } from '../src/bulk'
import { mockFromSchema } from '../src/schema'
import { loop } from './_util'

test('default bulk mock', () => {
  loop(() => {
    const defaultBulkMock = bulkMock(mockFromSchema)({
      type: 'string'
    })
    expect(defaultBulkMock.every(item => typeof item === 'string')).toBe(true)
    expect(defaultBulkMock.length).toBeGreaterThanOrEqual(1)
    expect(defaultBulkMock.length).toBeLessThanOrEqual(4)
  })
})

test('minimum bulk mock', () => {
  loop(() => {
    const minimumBulkMock = bulkMock(
      mockFromSchema,
      2
    )({
      type: 'string'
    })
    expect(minimumBulkMock.every(item => typeof item === 'string')).toBe(true)
    expect(minimumBulkMock.length).toBeGreaterThanOrEqual(2)
    expect(minimumBulkMock.length).toBeLessThanOrEqual(4)
  })
})

test('minimum & maximum bulk mock', () => {
  loop(() => {
    const rangedBulkMock = bulkMock(
      mockFromSchema,
      6,
      20
    )({
      type: 'string'
    })
    expect(rangedBulkMock.every(item => typeof item === 'string')).toBe(true)
    expect(rangedBulkMock.length).toBeGreaterThanOrEqual(2)
    expect(rangedBulkMock.length).toBeLessThanOrEqual(20)
  })
})
