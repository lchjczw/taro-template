import Bem from '@txjs/bem'
import { useLoad } from '@tarojs/taro'
import { nextTick } from '@/utils'
import { useChildren } from '../composables'
import { truthProp, numericProp } from '../utils'

import {
  defineComponent,
  watch,
  type ExtractPropTypes,
  type InjectionKey
} from 'vue'

const [name, bem] = Bem('cell-group')

const cellGroupProps = {
  title: String,
  inset: Boolean,
  border: truthProp,
  titleWidth: numericProp
}

export type CellGroupProps = ExtractPropTypes<typeof cellGroupProps>

export type CellGroupProvide = {
  props: CellGroupProps
}

export const CELL_GROUP_KEY: InjectionKey<CellGroupProvide> = Symbol(name)

export default defineComponent({
  name,

  inheritAttrs: false,

  props: cellGroupProps,

  setup(props, { slots, attrs }) {
    const { children, linkChildren } = useChildren(CELL_GROUP_KEY)

    const setBorder = () => {
      if (children.length) {
        const last = children[children.length - 1]
        last.setBorder(false)
      }
    }

    watch(
      () => children.length,
      setBorder
    )

    linkChildren({ props })

    useLoad(() => nextTick(setBorder))

    const renderGroup = () => (
      <view
        {...attrs}
        class={[
          bem({ inset: props.inset }),
          { 'hairline-surround': props.border && !props.inset }
        ]}
      >
        {slots.default?.()}
      </view>
    )

    const renderTitle = () => (
      <view class={bem('title', { inset: props.inset })}>
        {slots.title?.() ?? props.title}
      </view>
    )

    return () => {
      if (props.title || slots.title) {
        return (
          <>
            {renderTitle()}
            {renderGroup()}
          </>
        )
      }

      return renderGroup()
    }
  }
})
