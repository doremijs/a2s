import { JSONSchema7 } from 'json-schema'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'

export interface YAPIQueryPath {
  path: string
  params: string[]
}

export interface YAPIReqParam {
  _id?: string
  name: string
  example?: string
  desc?: string
}

export interface YAPIReqQuery {
  required: string
  _id?: string
  name: string
  example?: string
  desc?: string
}

export interface YAPIReqHeader {
  required: string
  _id?: string
  name: string
  value?: string
}

export interface YAPIReqBodyForm {
  required: string
  _id?: string
  name: string
  type: string
  example?: string
  desc?: string
}

export interface YAPIItem {
  query_path: YAPIQueryPath
  edit_uid?: number
  status: 'done' | 'undone'
  type?: string
  req_body_is_json_schema?: boolean
  res_body_is_json_schema?: boolean
  api_opened?: boolean
  index?: number
  tag?: string[]
  _id?: number
  method: Method
  catid?: number
  title: string
  path: string
  project_id?: number
  req_params: YAPIReqParam[]
  res_body_type: 'json' | 'raw'
  req_query: YAPIReqQuery[]
  req_headers?: YAPIReqHeader[]
  req_body_form: YAPIReqBodyForm[]
  desc?: string
  markdown?: string
  res_body: string | JSONSchema7
  uid?: number
  add_time?: number
  up_time?: number
  __v?: number
  req_body_type?: 'form' | 'json' | 'file' | 'raw'
  req_body_other?: string | JSONSchema7
}

export interface YAPIDesc {
  index: number
  name: string
  desc?: string
  add_time?: number
  up_time?: number
  list: YAPIItem[]
}

export type YAPIDocument = YAPIDesc[]
