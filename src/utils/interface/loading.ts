import extend from 'extend'
import { showLoading as taroShowLoading, hideLoading as taroHideLoading } from '@tarojs/taro'
import { isString } from '@txjs/bool'
import { GUARD_STORE } from './guard'
import { toast } from './toast'

type ShowLoadingOption = NonNullable<Parameters<typeof taroShowLoading>[0]>

export class Loading {
  private options: ShowLoadingOption = {
    mask: true,
    title: '加载中'
  }

  constructor() {}

  async show(options?: ShowLoadingOption['title'] | ShowLoadingOption): Promise<TaroGeneral.CallbackResult> {
    if (GUARD_STORE.TOAST) {
      await toast.hide()
    }

    if (isString(options)) {
      options = { title: options }
    }

    options = extend({}, this.options, options || {})

    try {
      const $loading = await taroShowLoading(options)
      GUARD_STORE.LOADING = true
      return $loading
    } catch (e) {
      GUARD_STORE.LOADING = false
      return e
    }
  }

  async hide() {
    try {
      await taroHideLoading()
    } finally {
      GUARD_STORE.LOADING = false
    }
  }

  setConfig(options: Partial<ShowLoadingOption>) {
    this.options = extend(this.options, options)
  }
}

export const loading = new Loading()
