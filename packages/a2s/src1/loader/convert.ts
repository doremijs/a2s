// import { JSONSchema7 } from 'json-schema'
import { OpenAPIV3 } from 'openapi-types'
import { APIRenderItem, Method, YAPIDocument } from '../types'
import { randomID } from '../utils'

// export default function convertYAPIToOpenAPI(apis: YAPIDocument): OpenAPIV3.Document {
//   return {
//     openapi: '3.0.0',
//     tags: apis.map(apiG => ({
//       name: apiG.name,

//     })),
//     paths: apis.reduce<OpenAPIV3.Document['paths']>((obj, api) => {
//       obj[api.]
//       return obj
//     }, {})
//   }
// }

type YAPIApiItem = YAPIDocument[number]['list'][number] & { group: string }

export function convertOpenAPIToYAPI(doc: OpenAPIV3.Document): YAPIDocument {
  function getSchema<T>(obj: OpenAPIV3.ReferenceObject | T) {
    if ('$ref' in obj) {
      const [, , _module, schema] = obj.$ref.split('/')
      return doc.components[_module as keyof OpenAPIV3.ComponentsObject][schema]
    }
    return null
  }
  const allApis = Object.keys(doc.paths).reduce<YAPIApiItem[]>((arr, path) => {
    Object.keys(doc.paths[path]).forEach(method => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const api = doc.paths[path][method] as OpenAPIV3.Document['paths'][number]['get']
      const paramsMap: Record<string, OpenAPIV3.ParameterObject> = {}
      const queryArr: OpenAPIV3.ParameterObject[] = []
      const bodyArr: OpenAPIV3.ParameterObject[] = []
      api.parameters.forEach(param => {
        if ('$ref' in param) {
          // TODO
        } else {
          switch (param.in) {
            case 'path':
              paramsMap[param.name] = param
              break
            case 'query':
              queryArr.push(param)
              break
            case 'formData':
            case 'body':
              bodyArr.push(param)
              break
            default:
              break
          }
        }
      })
      const urlParams = [
        ...(path.match(/\/:([\w]+)/g)?.map(item => item.replace(/^\/:/, '')) ?? []),
        ...(path.match(/\/{([\w]+)}/g)?.map(item => item.replace(/^\/{/, '').replace(/\}$/, '')) ??
          [])
      ]
      const isGet = method === 'get'
      // const isFormData =
      //   api.consumes?.some(type =>
      //     ['multipart/form-data', 'application/x-www-form-urlencoded'].includes(type)
      //   ) ?? false
      // FIXME
      const isFormData = !api.requestBody
        ? false
        : '$ref' in api.requestBody
        ? false
        : ['multipart/form-data', 'application/x-www-form-urlencoded'].some(
            type => type in api.requestBody
          )
      const respObj = (api.responses['200'] || api.responses['201']) ?? {}
      getSchema(respObj)
      arr.push({
        group: api.tags?.[0] ?? 'default',
        query_path: {
          path,
          params: urlParams
        },
        status: 'done',
        method: method.toUpperCase() as Method,
        title: api.summary ?? api.description ?? path,
        path,
        req_params: urlParams.map(param => ({
          _id: randomID(),
          name: param,
          desc: paramsMap[param].description ?? '',
          example: paramsMap[param].example ?? ''
        })),
        req_query: queryArr.map(query => ({
          required: query.required ? '1' : '0',
          _id: randomID(),
          name: query.name,
          desc: query.description ?? '',
          example: query.example ?? ''
        })),
        req_body_type: isGet ? undefined : isFormData ? 'form' : 'json',
        req_body_form: isGet
          ? []
          : isFormData
          ? bodyArr.map(bodyItem => ({
              required: bodyItem.required ? '1' : '0',
              _id: randomID(),
              name: bodyItem.name,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              type: bodyItem.type === 'file' ? 'file' : 'text'
            }))
          : [],
        // TODO
        req_body_other: isGet ? undefined : isFormData ? undefined : '',
        res_body: (api.responses['200'] || api.responses['201']) ?? {},
        res_body_type: 'json'
      })
    })
    return arr
  }, [])
  const groupMap: Record<string, YAPIDocument[number]> = {}
  return allApis.reduce<YAPIDocument>((doc, api) => {
    if (!groupMap[api.group]) {
      groupMap[api.group] = {
        index: 0,
        name: api.group,
        // desc: '',
        list: []
      }
      doc.push(groupMap[api.group])
    }
    groupMap[api.group].list.push(api)
    return doc
  }, [])
}

export function convertYAPIToRenderData(doc: YAPIDocument) {
  return doc.reduce<APIRenderItem[]>((arr, item) => {
    item.list.forEach(api => {
      arr.push({
        ...api,
        group: item.name,
        res_body: {},
        req_body_other: {}
        // res_body:
        //   typeof api.res_body === 'string'
        //     ? (JSON.parse(api.res_body) as JSONSchema7)
        //     : api.res_body,
        // req_body_other:
        //   typeof api.req_body_other === 'string'
        //     ? (JSON.parse(api.req_body_other) as JSONSchema7)
        //     : api.req_body_other
      })
    })
    return arr
  }, [])
}
