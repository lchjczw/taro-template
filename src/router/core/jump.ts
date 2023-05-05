import type { RouterQuery, RouterOption, RouterPath } from '../types'

import { router } from '..'
import { queryStringify, queryParse } from '../utils'

import {
  switchTab as taroSwitchTab,
  reLaunch as taroRreLaunch,
  redirectTo as taroRedirectTo,
  navigateTo as taroNavigateTo,
  navigateBack as taroNavigateBack
} from '@tarojs/taro'

import {
  noop,
  callInterceptor,
  interceptorAll,
  type Interceptor
} from '@txjs/shared'

import {
  isNil,
  isPlainObject,
  isFunction
} from '@txjs/bool'

interface JumpMethodsCallback {
  (path: string | RouterOption<string>): void
  (path: RouterPath | RouterOption): void
  (path: string, query?: RouterQuery): void
  (path: RouterPath, query?: RouterQuery): void
  (path: string, beforeEnter?: Interceptor): void
  (path: RouterPath, beforeEnter?: Interceptor): void
}

export class Jump {
  private interceptor?: Interceptor

  constructor() {}

  private methods<T extends Function>(func: T, switchTab = false) {
    const callback: JumpMethodsCallback = (
      path:
        | string
        | RouterPath
        | RouterOption
        | RouterOption<string>,
      query?: RouterQuery,
      beforeEnter?: Interceptor
    ) => {
      if (isPlainObject(path)) {
        query = path?.query
        beforeEnter = path?.beforeEnter
        path = path.path
      }

      if (isFunction(query)) {
        beforeEnter = query
        query = undefined
      }

      let queryStr = ''

      if (path.indexOf('?') !== -1) {
        const paths = path.split('?')
        path = paths[0]
        queryStr = paths[1]
      }

      const meta = router.getRouteByMeta(path)

      if (isNil(meta)) {
        return
      } else {
        meta.query = queryParse(query)
      }

      if (switchTab === false) {
        const str = queryStringify(query)
        queryStr = `${str.indexOf('?') !== 0 ? '?' : ''}${str}&${queryStr}`
      }

      callInterceptor(interceptorAll, {
        canceled: noop,
        args: [[this.interceptor, beforeEnter], meta],
        done: () => {
          func({ url: `${meta.path}${queryStr}` })
        }
      })
    }
    return callback
  }

  /**
   * 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层
   */
  navigateBack(delta: number) {
    taroNavigateBack.apply(null, [delta])
  }

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   */
  switchTab = this.methods(taroSwitchTab, true)

  /**
   * 关闭所有页面，打开到应用内的某个页面
   */
  reLaunch = this.methods(taroRreLaunch)

  /**
   * 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
   */
  redirectTo = this.methods(taroRedirectTo)

  /**
   * 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 Taro.navigateBack 可以返回到原页面。小程序中页面栈最多十层
   */
  navigateTo = this.methods(taroNavigateTo)

  /**
   * 跳转之前拦截
   */
  beforeEnter(interceptor: Interceptor) {
    this.interceptor = interceptor
  }
}
