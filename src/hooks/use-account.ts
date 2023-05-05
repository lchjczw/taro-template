import { reactive } from 'vue'
import { isNil, isValidString } from '@txjs/bool'
import { checkTabbarRouter, getAppConfig } from '@/utils'

import {
  useRouter,
  getCurrentPages,
  clearStorageSync
} from '@tarojs/taro'

import {
  router,
  jump,
  queryParse,
  queryStringify
} from '@/router'

const loginMeta = router.getRouteByMeta('login')

export const REDIRECT_URI = 'redirect_uri'
export const REDIRECT_PARAMS = 'redirect_params'

export const useAccount = () => {
  const { pages } = getAppConfig()
  const { params } = useRouter()

  let redirect_uri = params[REDIRECT_URI]
  let scene = params['scene']

  if (isValidString(redirect_uri)) {
    redirect_uri = decodeURIComponent(redirect_uri)
  }

  if (isValidString(scene)) {
    const query = queryParse(
      decodeURIComponent(scene)
    )

    // 自定义获取数据
  }

  const from = reactive({
    [REDIRECT_PARAMS]: redirect_uri
  })

  const redirectTo = (callback?: Callback) => {
    const { length } = getCurrentPages()
    const redirectURL = from[REDIRECT_PARAMS]

    if (redirectURL) {
      if (callback) {
        callback(redirectURL)
      } else {
        checkTabbarRouter(redirectURL) ? jump.reLaunch(redirectURL) : jump.redirectTo(redirectURL)
      }
    } else if (length > 1) {
      jump.navigateBack(1)
    } else {
      jump.reLaunch(pages![0])
    }
  }

  return { from, params, redirectTo }
}

export const useJumpLogin = (
  path?: string,
  params: Record<string, any> = {},
  linkType: 'navigateTo' | 'redirectTo' = 'navigateTo'
) => {
  if (isNil(path)) {
    const target = useRouter()
    path = target.path
    params = target.params
    linkType = 'redirectTo'
  }

  if (isNil(loginMeta) || path.startsWith(loginMeta.path)) {
    return
  }

  if (params.$taroTimestamp) {
    delete params.$taroTimestamp
  }

  if (checkTabbarRouter(path)) {
    jump.navigateTo(loginMeta.path)
  } else {
    jump[linkType](loginMeta.path, {
      [REDIRECT_URI]: encodeURIComponent(`${path}${queryStringify(params)}`),
    })
  }

  clearStorageSync()
}
