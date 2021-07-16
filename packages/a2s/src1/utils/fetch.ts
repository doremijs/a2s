import axios from 'axios'
import ora from 'ora'
import { DataSourceConfig } from '../types'

async function commonFetch(url: string, type: string, params?: Record<string, any>) {
  const spinner = ora({ text: `Fetching ${type} configs...`, spinner: 'bouncingBar' }).start()
  let res
  try {
    res = await axios.get(url, {
      responseType: 'json',
      timeout: 60000,
      timeoutErrorMessage: `${type} 接口请求超时`,
      params
    })
    spinner.stop()
    if (res.status >= 200 && res.status < 300) {
      return res.data
    }
  } catch (error) {
    console.error(error.code, `${type} 接口数据获取出错，请尝试检查配置`)
    console.error(error.message)
    console.error(error.stack)
    process.exit(-1)
  }
  return ''
}

function fetchOpenAPI(url: string) {
  return commonFetch(url, 'OpenAPI')
}

function fetchYAPI(url: string, projectId: number, token: string) {
  return commonFetch(`${url}/api/plugin/export`, 'YAPI', {
    type: 'json',
    pid: projectId,
    status: 'all',
    isWiki: false,
    token: token
  })
}

export async function fetchJson(config: DataSourceConfig) {
  if (config.type === 'yapi') {
    const json = await fetchYAPI(config.apiPrefix, config.projectId, config.token)
    return json
  } else if (config.type === 'openapi') {
    const json = await fetchOpenAPI(config.apiPrefix)
    return json
  }
}
