import { isNil, isNumeric } from '@txjs/bool'

/**
 * 字符串驼峰式
 *
 * @example
 * ```ts
 * camelize('-a-b-c')
 * // => ABC
 * ```
 */
export function camelize(value = '') {
  return value.replace(/-(\w)/g, (_, c) => c.toUpperCase())
}

/**
 * css样式添加
 *
 * @example
 * ```ts
 * addUnit(12)
 * // => 12rpx
 * addUnit('10px')
 * // => 10rpx
 * addUnit(10, 2)
 * // => 20rpx
 * ```
 */
export function addUnit(value?: Numeric, multiple = 1) {
  if (isNil(value)) {
    return
  }

  if (isNumeric(value)) {
    return `${value * multiple}${process.env.PIXEL}`
  }

  return value
}
