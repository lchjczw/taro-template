import extend from 'extend'
import { showToast as taroShowToast, hideToast as taroHideToast } from '@tarojs/taro'
import { isString } from '@txjs/bool'
import { GUARD_STORE } from './guard'
import { loading } from './loading'

type ShowToastOption = NonNullable<Parameters<typeof taroShowToast>[0]>

export class Toast {
  private handleTimer: ReturnType<typeof setTimeout> | null = null
  private options: ShowToastOption = {
    title: '',
    icon: 'none',
    mask: true,
    duration: 1500
  }

  constructor() {}

  async show(options: ShowToastOption['title'] | ShowToastOption): Promise<TaroGeneral.CallbackResult> {
    if (GUARD_STORE.LOADING) {
      await loading.hide()
    }

    if (isString(options)) {
      options = { title: options }
    }

    options = extend({}, this.options, options || {})

    try {
      const $toast = await taroShowToast(options)
      GUARD_STORE.TOAST = true
      // 清除上一次定时器
      clearTimeout(this.handleTimer!)
      // 定时改变使用状态
      this.handleTimer = setTimeout(() => {
        GUARD_STORE.TOAST = false
      }, options.duration)
      return $toast
    } catch (e) {
      GUARD_STORE.TOAST = true
      return e
    }
  }

  async hide() {
    try {
      await taroHideToast()
    } finally {
      GUARD_STORE.TOAST = false
    }
  }

  private methods(icon: ShowToastOption['icon']) {
    return async (options: ShowToastOption['title'] | Omit<ShowToastOption, 'icon'>) => {
      if (isString(options)) {
        options = { title: options }
      }

      options = extend(options, { icon })

      return await this.show(options)
    }
  }

  success = this.methods('success')
  error = this.methods('error')
  loading = this.methods('loading')

  setConfig(options: Partial<ShowToastOption>) {
    this.options = extend(this.options, options)
  }
}

export const toast = new Toast()
