import type { ViewProps } from '@tarojs/components'

import Bem from '@txjs/bem'
import { isArray } from '@txjs/bool'
import { addUnit } from '@/utils'
import { useChildren } from '../composables'

import {
  defineComponent,
  type PropType,
  type InjectionKey,
  type ExtractPropTypes
} from 'vue'

const [name, bem] = Bem('row')

const rowProps = {
  type: String,
  align: String,
  justify: String,
  onTap: Function as PropType<ViewProps['onTap']>,
  gutter: {
    type: [Number, Array] as PropType<number | number[]>,
    default: 0
  }
}

export type RowProps = ExtractPropTypes<typeof rowProps>
export type RowProvide = {
  props: RowProps
}

export const ROW_KEY: InjectionKey<RowProvide> = Symbol(name)

export default defineComponent({
  name,

  props: rowProps,

  setup(props, { slots }) {
    const { linkChildren } = useChildren(ROW_KEY)
    const flex = props.type === 'flex'
    const gutter = isArray(props.gutter) ? props.gutter[0] : props.gutter
    const margin = `-${addUnit(gutter)}`
    const style = gutter ? { marginLeft: margin, marginRight: margin } : {}

    linkChildren({ props })

    return () => {
      const { align, justify } = props

      return (
        <view
          style={style}
          class={bem({
            flex,
            [`align-${align}`]: flex && align,
            [`justify-${justify}`]: flex && justify
          })}
        >
          {slots.default?.()}
        </view>
      )
    }
  }
})
