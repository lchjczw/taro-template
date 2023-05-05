import extend from 'extend'
import { showModal as taroShowModal } from '@tarojs/taro'
import { isString } from '@txjs/bool'

type BaseShowModalOption = NonNullable<Parameters<typeof taroShowModal>[0]>

interface ShowModalOption extends Omit<BaseShowModalOption, 'success'> {
  onOk?(): void
  onCancel?(): void
}

export class Modal {
  private options: ShowModalOption = {
    confirmColor: process.env.COLOR_CONFIRM
  }

  constructor() {}

  show(options: NonNullable<ShowModalOption['content']> | ShowModalOption) {
    if (isString(options)) {
      options = { content: options }
    }

    const { onOk, onCancel, ...extra } = options

    const success = ({ confirm, cancel }: Record<'confirm' | 'cancel', boolean>) => {
      if (confirm) {
        onOk?.()
      } else if (cancel) {
        onCancel?.()
      }
    }

    taroShowModal(
      extend({}, this.options, extra, { success })
    )
  }

  info(options: NonNullable<ShowModalOption['content']> | Omit<ShowModalOption, 'showCancel'>) {
    if (isString(options)) {
      options = { content: options }
    }

    this.show(
      extend({}, options, { showCancel: false })
    )
  }

  setConfig(options: Partial<ShowModalOption>) {
    this.options = extend(this.options, options)
  }
}

export const modal = new Modal()
