import type { ViewProps } from '@tarojs/components'

import Bem from '@txjs/bem'
import extend from 'extend'
import { addUnit } from '@/utils'
import { numericProp, getSizeStyle } from '../utils'

import {
  defineComponent,
  computed,
  type PropType,
  type CSSProperties
} from 'vue'

const [name, bem] = Bem('loading')

const loadingProps = {
  size: numericProp,
  vertical: Boolean,
  textSize: numericProp,
  color: String as PropType<CSSProperties['color']>,
  textColor: String as PropType<CSSProperties['color']>,
  onTap: Function as PropType<ViewProps['onTap']>
}

export default defineComponent({
  name,

  props: loadingProps,

  setup(props, { slots }) {
    const spinnerStyle = computed(() =>
      extend({
        color: props.color,
        fontSize: addUnit(props.size),
      }, getSizeStyle(props.size))
    )

    const renderIcon = () => (
      <view
        class={bem('spinner')}
        style={spinnerStyle.value}
      />
    )

    const renderText = () => {
      if (slots.default) {
        return (
          <view
            class={bem('text')}
            style={{
              fontSize: addUnit(props.textSize),
              color: props.textColor ?? props.color
            }}
          >
            {slots.default()}
          </view>
        )
      }
    }

    return () => {
      const { vertical } = props
      return (
        <view
          class={bem({ vertical })}
          aria-live="polite"
          aria-busy={true}
        >
          {renderIcon()}
          {renderText()}
        </view>
      )
    }
  }
})
