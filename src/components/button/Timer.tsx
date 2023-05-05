import type { ButtonSize } from './types'

import { Button } from '../button'

import Bem from '@txjs/bem'
import extend from 'extend'
import { makeStringProp } from '../utils'
import { buttonProps, buttonPropKeys } from './utils'

import {
  pick,
  callInterceptor,
  type Interceptor
} from '@txjs/shared'

import {
  defineComponent,
  reactive,
  onUnmounted,
  type PropType
} from 'vue'

const [name, bem] = Bem('timer-button')

const timerProps = {
  size: makeStringProp<ButtonSize>('mini'),
  beforeChange: Function as PropType<Interceptor>,
  delay: {
    type: Number as PropType<number>,
    default: 120
  },
  text: {
    type: String,
    default: '获取验证码'
  },
  beforeText: {
    type: String,
    default: '<s>秒后重发'
  },
  afterText: {
    type: String,
    default: '重新获取'
  }
}

export default defineComponent({
  name,

  inheritAttrs: false,

  props: extend({}, buttonProps, timerProps),

  setup(props, { slots }) {
    const state = reactive({
      delay: props.delay,
      disabled: false,
      loading: false,
      endTimer: false
    })

    let timer: ReturnType<typeof setInterval>

    const onClear = () => {
      clearInterval(timer)
      timer = null!
      state.disabled = false
      state.delay = props.delay
    }

    const onTimer = () => {
      if (state.delay > 0) {
        state.delay--
      } else {
        state.endTimer = true
        onClear()
      }
    }

    const onCountdown = () => {
      state.disabled = true
      state.endTimer = false
      timer = setInterval(onTimer, 1000)
    }

    const onClick = () => {
      state.loading = true
      callInterceptor(props.beforeChange, {
        done: () => {
          onCountdown()
          state.loading = false
        },
        canceled: () => {
          state.loading = false
        }
      })
    }

    const renderText = () => {
      if (state.disabled) {
        return props.beforeText.replace(/^<.*>(.*)?$/g, `${state.delay} $1`)
      }

      if (state.endTimer) {
        return props.afterText
      }

      return slots.default?.() ?? props.text
    }

    onUnmounted(onClear)

    return () => (
      <Button
        {...pick(extend({}, props, state), buttonPropKeys)}
        class={bem()}
        onTap={onClick}
      >
        {renderText()}
      </Button>
    )
  }
})
