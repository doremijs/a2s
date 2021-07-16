import { JSONSchema7 } from 'json-schema'
import { YAPIDocument } from './yapi'

export * from './config'
export * from './yapi'

export type APIRenderItem = YAPIDocument[number]['list'][number] & {
  group: string
  res_body: JSONSchema7
  req_body_other: JSONSchema7
}
