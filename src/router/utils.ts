import type { RouterQuery } from './types'

import {
  isNil,
  isString,
  isValidString,
  isPlainObject
} from '@txjs/bool'

function _encodeURL(value: string) {
  if (/^http(s):\/\//i.test(value)) {
    return decodeURIComponent(value)
  }
  return value
}

/**
 * 格式化URL查询参数
 */
export function queryParse(value?: RouterQuery) {
  if (isNil(value)) {
    return {}
  } else if (isPlainObject(value)) {
    return value
  }

  return value
    .split('&')
    .reduce(
      (params, curr) => {
        if (isValidString(curr)) {
          const index = curr.indexOf('=')
          const key = curr.slice(0, index)
          const param = curr.slice(index + 1, curr.length)
          params[key] = param
        }
        return params
      }, {} as Record<string, string>
    )
}

/**
 * 生成URL查询参数
 */
export function queryStringify(query?: RouterQuery) {
  if (isNil(query)) {
    return ''
  }

  if (isString(query)) {
    return query
  }

  const str = Object.keys(query)
    .map((key) => `${key}=${_encodeURL(query[key])}`)
    .join('&')

  return `?${str}`
}
