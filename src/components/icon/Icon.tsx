import type { ViewProps } from '@tarojs/components'
import type { IconName } from './types'

import Bem from '@txjs/bem'
import { addUnit } from '@/utils'
import { numericProp } from '../utils'

import {
  defineComponent,
  type PropType,
  type CSSProperties
} from 'vue'

const [name, bem] = Bem('icon')

const classPrefix = 'van-icon'

const iconProps = {
  size: numericProp,
  color: String as PropType<CSSProperties['color']>,
  onTap: Function as PropType<ViewProps['onTap']>,
  onTouchStart: Function as PropType<ViewProps['onTouchStart']>,
  name: {
    type: String as PropType<IconName>,
    required: true
  }
}

export default defineComponent({
  name,

  inheritAttrs: false,

  props: iconProps,

  setup(props, { slots, attrs }) {
    return () => (
      <view
        {...attrs}
        class={[
          bem(),
          classPrefix,
          `${classPrefix}-${props.name}`
        ]}
        style={{
          color: props.color,
          fontSize: addUnit(props.size)
        }}
        onTap={props.onTap}
        // @ts-ignore
        onTouchstart={props.onTouchStart}
      >
        {slots.default?.()}
      </view>
    )
  }
})
