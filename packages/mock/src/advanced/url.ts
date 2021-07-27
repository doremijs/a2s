/**
 * mock文件地址，图片地址等
 */

/**
 * @link https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 */
export interface MediaType {
  type: 'text' | 'image' | 'audio' | 'video' | 'application'
}

export function mockUrl(mediaTypeOrExt: MediaType | string): string {
  //
}
