import type { ParamsType } from 'miniprogram-network-utils'
import type { RequestConfig, SuccessParam, XHR } from '@txjs/taro-request'

import { REQUEST } from '@txjs/taro-request'
import { isPlainObject, isUndefined } from '@txjs/bool'
import { useJumpLogin } from '@/hooks'
import { useUserStore } from '@/stores'
import { toast } from '@/utils'

type BaseData = string | object | ArrayBuffer | undefined

// 兼容第三方接口
const transformData1 = (data: Record<string, any>) => {
  if ('errno' in data) {
    if (data.errno === 0) {
      data.errno = 200
    }

    data.code = data.errno
    data.msg = data.errmsg
    delete data.errno
    delete data.errmsg
  }
  return data
}

const transformData = [
  transformData1
]

const transformResponse = (config: Record<string, any>) => {
  if (isPlainObject(config?.data)) {
    config.data = transformData.reduce(
      (ret, transform) => transform(ret), config.data
    )
  } else if (process.env.TARO_ENV === 'alipay' && config.error) {
    config.data = {
      code: config.error,
      msg: config.data || config.errorMessage,
      data: null
    }
  }

  if (process.env.TARO_ENV === 'alipay') {
    config.statusCode = config.status ?? config?.data?.code ?? 500
  }

  return config
}

REQUEST.Defaults.retry = 0
REQUEST.Defaults.baseURL = process.env.BASE_URL
REQUEST.Defaults.transformResponse = (config) => {
  const { statusCode, data } = transformResponse(config)

  if (statusCode === 200 && data.code === 200) {
    return Promise.resolve(data.data)
  } else if (statusCode === 401) {
    useJumpLogin()
  } else {
    toast.show(data?.msg || '请求失败')
  }

  return Promise.reject(data)
}

REQUEST.Listeners.onRejected.push((res) => {
  if (res.errMsg.startsWith('request:fail')) {
    toast.show('请求错误，稍后再试')
  }
})

const cleanUndef = <T extends BaseData>(data?: T) => {
  if (isPlainObject(data)) {
    Object.keys(data).forEach((key) => {
      if (isUndefined((data as any)[key])) {
        (data as any)[key] = ''
      }
    })
  }
  return data
}

const transformRequestConfig = <
  TReturn = SuccessParam<XHR.RequestOption>,
  TParams = ParamsType
>(config?: RequestConfig<TParams, {}, TReturn>) => {
  const usersStore = useUserStore()

  config ??= {}
  config.timeout = 30000

  if (!('headers' in config)) {
    config.headers = {}
  }

  if (usersStore.hasLogged) {
    config.headers!['Authorization'] = `Bearer ${usersStore.user_token}`
  }

  return config!
}

class Request {
  constructor() {}

  #method(method: NonNullable<XHR.RequestOption['method']>) {
    return <
      TReturn = SuccessParam<XHR.RequestOption>,
      TData extends BaseData = BaseData,
      TParams = ParamsType
    >(
      action: string,
      data?: TData,
      config?: RequestConfig<TParams, {}, TReturn>
    ) => {
      config = transformRequestConfig(config)
      data = cleanUndef(data)
      if (method === 'POST') {
        if (!('Content-Type' in config.headers!)) {
          config.headers!['Content-Type'] = 'application/x-www-form-urlencoded'
        }
      }
      return REQUEST.request<TReturn>(method, action, data, config)
    }
  }

  get = this.#method('GET')
  post = this.#method('POST')
  delete = this.#method('DELETE')
  put = this.#method('PUT')
  head = this.#method('HEAD')
  trace = this.#method('TRACE')
  connect = this.#method('CONNECT')
  options = this.#method('OPTIONS')

  /** 直接返回错误 */
  rejected(msg: string, code = 500) {
    return Promise.reject({ msg, code })
  }
}

export const request = new Request()
