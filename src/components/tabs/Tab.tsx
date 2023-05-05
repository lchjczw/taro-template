import type { ITouchEvent } from '@tarojs/components'

import { TABS_KEY } from './Tabs'

import Bem from '@txjs/bem'
import { isNil } from '@txjs/bool'
import { useParent, useExpose } from '../composables'

import {
  defineComponent,
  computed,
  type ComputedRef,
  type ExtractPropTypes
} from 'vue'

const [name, bem] = Bem('tab')

const tabProps = {
  title: String,
  disabled: Boolean,
  name: [Number, String]
}

export type TabProps = ExtractPropTypes<typeof tabProps>

export type TabExpose = {
  id: ComputedRef<string>
}

export const TAB_NAME_KEY = Symbol(name)

export default defineComponent({
  unique_name: TAB_NAME_KEY,

  name,

  props: tabProps,

  setup(props, { slots }) {
    const { parent, index } = useParent(TABS_KEY)

    if (isNil(parent)) {
      return
    }

    const id = computed(() =>
      `${parent.id}-${name}`
    )
    const identifies = computed(() =>
      props.name || index.value
    )
    const current = computed(() =>
      identifies.value === parent.props.value
    )

    const onTabClick = (event: ITouchEvent) => {
      parent.props.onClickTab?.({
        event,
        name: identifies.value,
        title: props.title,
        disabled: props.disabled
      })

      if (!props.disabled) {
        parent.update(identifies.value)
      }
    }

    useExpose({ id, identifies })

    return () => (
      <view
        class={[
          id.value,
          bem({
            active: current.value,
            disabled: props.disabled
          })
        ]}
        onTap={onTabClick}
      >
        <view
          class={[
            bem('text'),
            { ellipsis: parent.scrollable.value }
          ]}
        >
          {slots.default?.({
            name: identifies.value,
            active: current.value
          }) || props.title}
        </view>
      </view>
    )
  }
})
