import extend from 'extend'
import { isNil } from '@txjs/bool'

import {
  nextTick as taroNextTick,
  getApp as taroGetApp,
  hideHomeButton as taroHideHomeButton,
  getSystemInfoSync as taroGetSystemInfoSync,
  getAccountInfoSync as taroGetAccountInfoSync,
  createSelectorQuery as taroCreateSelectorQuery
} from '@tarojs/taro'

import {
  canIUseNextTick,
  canIUseHideHomeButton,
  canIUseGetAccountInfoSync
} from './version'

/**
 * 延迟一部分操作到下一个时间片再执行
 * * 当前在tarojs支持nextTick基础上使用setTimeout再次延迟
 * * 不支持nextTick方法，则直接使用setTimeout延迟
 */
export const nextTick = (callbck: Callback) => {
  if (canIUseNextTick()) {
    taroNextTick(() => setTimeout(callbck, 1))
  } else {
    setTimeout(callbck, 1000 / 30)
  }
}

/**
 * 隐藏返回首页按钮
 * * 微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，默认展示“返回首页”按钮
 * * 开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏
 */
export const hideHomeButton = () => {
  if (canIUseHideHomeButton()) {
    taroHideHomeButton()
  } else if (process.env.TARO_ENV === 'alipay') {
    my.hideBackHome()
  }
}

let AppConfig: Taro.Config
/**
 * 获取到小程序全局配置
 */
export const getAppConfig = () => {
  if (isNil(AppConfig)) {
    const { config = {} } = taroGetApp()
    AppConfig = config
  }
  return AppConfig
}

let systemInfo: SystemInfo
/**
 * 获取小程序系统环境
 */
export const getSystemInfoSync = () => {
  if (isNil(systemInfo)) {
    const { system, ...info } = taroGetSystemInfoSync()
    const isIOS = system.startsWith('iOS')
    const isAnd = system.startsWith('Android')
    const isMobile = isIOS || isAnd
    const isPC = system.startsWith('Windows') || system.startsWith('macOS')
    const hasSafeArea = info.safeArea?.bottom !== info.screenHeight

    systemInfo = extend(info, { system, isIOS, isAnd, isPC, isMobile, hasSafeArea })

    if (process.env.TARO_ENV === 'alipay') {
      systemInfo.SDKVersion = my.SDKVersion
    }
  }
  return systemInfo
}

let miniProgram: AccountInfo
/**
 * 获取当前帐号信息
 */
export const getAccountInfoSync = () => {
  if (isNil(miniProgram)) {
    if (canIUseGetAccountInfoSync()) {
      miniProgram = taroGetAccountInfoSync().miniProgram
    } else if (process.env.TARO_ENV === 'alipay') {
      miniProgram = {
        appId: my.getAppIdSync().appId
      }

      my.getRunScene({
        success: (res) => {
          miniProgram.envVersion = res.envVersion
        }
      })
    }
  }
  return miniProgram
}

/**
 * 检查路径是否是tabbar页面
 */
export const checkTabbarRouter = (path: string) => {
  const { tabBar } = getAppConfig()
  if (isNil(tabBar)) {
    return false
  }
  return tabBar.list.some((item) => path.indexOf(item.pagePath) !== -1) || false
}

/**
 * 获取单个元素布局位置
 * * 其功能类似于DOM的getBoundingClientRect
 */
export const getRect = (
  selector: string,
  context?: TaroGeneral.IAnyObject
) => {
  return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>(
    (resolve) => {
      const query = taroCreateSelectorQuery()
      if (context) {
        query.in(context)
      }
      query.select(selector)
        .boundingClientRect()
        .exec((rect = []) => resolve(rect[0]))
    }
  )
}

/**
 * 获取多个元素布局位置
 * * 其功能类似于DOM的getBoundingClientRect
 * * 返回一个布局位置集合
 */
export const getAllRect = (
  selector: string,
  context?: TaroGeneral.IAnyObject
) => {
  return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult[]>(
    (resolve) => {
      const query = taroCreateSelectorQuery()
      if (context) {
        query.in(context)
      }
      query.selectAll(selector)
        .boundingClientRect()
        .exec((rect = []) => resolve(rect[0]))
    }
  )
}
