/**
 * mock文件地址，图片地址等
 */

/**
 * @link https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 */
import { Random } from 'mockjs'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../data/url.json')

export interface MediaType {
  type: 'text' | 'image' | 'audio' | 'video' | 'application'
}

export function mockUrl(mediaTypeOrExt: MediaType | string): string {
  if (typeof mediaTypeOrExt === 'object') {
    switch (mediaTypeOrExt.type) {
      case 'text':
        // eslint-disable-next-line no-case-declarations
        const random = Random.boolean()
        if (random) {
          return `https://v1.jinrishici.com/all.svg?font-size=18&spacing=4`
        } else {
          return `https://api.mcloc.cn/words`
        }
      case 'image':
        return `https://picsum.photos/200/300`
      case 'audio':
        // eslint-disable-next-line no-case-declarations
        const staged = []
        data[0].songs.forEach(element => {
          staged.push(element.id)
        })
        // eslint-disable-next-line no-case-declarations
        const index = Math.floor(Math.random() * staged.length)
        // eslint-disable-next-line no-case-declarations
        const id = staged[index]
        return `https://music.163.com/#/song?id=${id}`
      case 'video':
        return `https://random-ize.com/random-youtube/`
      case 'application':
        // eslint-disable-next-line no-case-declarations
        const stage = data[1].application
        // eslint-disable-next-line no-case-declarations
        const cIndex = Math.floor(Math.random() * stage.length)
        return staged[cIndex]
    }
  }
  if (typeof mediaTypeOrExt === 'string') {
    return `https://xxx.${mediaTypeOrExt}`
  }
}
