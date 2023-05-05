import type { CSSProperties } from 'vue'

import { isNil, isInteger, isArray } from '@txjs/bool'
import { addUnit } from '@/utils'

/**
 * css样式 `width` 和 `height`
 *
 * @example
 * ```ts
 * getSizeStyle(12)
 * // => { width: 12rpx, height: 12rpx }
 * ```
 */
export function getSizeStyle(originSize?: Numeric | Numeric[]): CSSProperties | undefined {
  if (isNil(originSize)) {
    return
  }

  if (isArray(originSize)) {
    return {
      width: addUnit(originSize[0]),
      height: addUnit(originSize[1])
    }
  }

  const size = addUnit(originSize)

  return {
    width: size,
    height: size
  }
}

/**
 * css样式 `z-index`
 *
 * @example
 * ```ts
 * getZIndexStyle(1)
 * // => { zIndex: 1 }
 * getZIndexStyle('999')
 * // => { zIndex: 999 }
 * ```
 */
export function getZIndexStyle(zIndex?: number | string) {
  const style = {} as CSSProperties

  if (isInteger(zIndex)) {
    style.zIndex = zIndex
  }

  return style
}
