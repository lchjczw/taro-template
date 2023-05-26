import type { ITouchEvent } from '@tarojs/components'

import extend from 'extend'
import { addUnit } from '@/utils'

import {
  defineComponent,
  computed,
  type PropType
} from 'vue'

import {
  unknownProp,
  truthProp,
  numericProp,
  makeStringProp,
  makeRequiredProp,
  preventDefault
} from '../utils'

export type CheckerShape = 'square' | 'round'

export type CheckerDirection = 'horizontal' | 'vertical'

export type CheckerLabelPosition = 'left' | 'right'

export type CheckerParent = {
  props: {
    disabled?: boolean
    iconSize?: Numeric
    direction?: CheckerDirection
    checkedColor?: string
  }
}

export const checkerProps = {
  name: unknownProp,
  shape: makeStringProp<CheckerShape>('round'),
  disabled: Boolean,
  iconSize: numericProp,
  value: unknownProp,
  checkedColor: String,
  labelPosition: String as PropType<CheckerLabelPosition>,
  labelDisabled: Boolean,
  onTap: Function as PropType<(event: ITouchEvent) => void>
}

export default defineComponent({
  props: extend({}, checkerProps, {
    bem: makeRequiredProp(Function),
    role: String,
    checked: Boolean,
    bindGroup: truthProp,
    parent: Object as PropType<CheckerParent | null>,
    onToggle: Function as PropType<() => void>
  }),

  setup(props, { slots }) {
    const getParentProp = <T extends keyof CheckerParent['props']>(name: T) => {
      if (props.parent && props.bindGroup) {
        return props.parent.props[name]
      }
    }

    const disabled = computed(() =>
      getParentProp('disabled') || props.disabled
    )

    const direction = computed(() => getParentProp('direction'))

    const iconStyle = computed(() => {
      const checkedColor = props.checkedColor || getParentProp('checkedColor')

      if (checkedColor && props.checked && !disabled.value) {
        return {
          borderColor: checkedColor,
          backgroundColor: checkedColor
        }
      }
      return {}
    })

    const onTap = (event: ITouchEvent) => {
      if (!disabled.value) {
        props.onToggle?.()
      }
      props.onTap?.(event)
    }

    const renderIcon = () => {
      const { bem, shape, checked } = props
      const iconSize = props.iconSize || getParentProp('iconSize')

      return (
        <view
          class={bem('icon', [shape, { checked, disabled: disabled.value }])}
          style={{ ...iconStyle.value, fontSize: addUnit(iconSize) }}
        >
          {slots.icon ? slots.icon({
            checked,
            disabled: disabled.value
          }) : (
            <view class={bem('icon-check')} />
          )}
        </view>
      )
    }

    const renderLabel = () => {
      if (slots.default) {
        return (
          <view
            class={props.bem('label', [
              props.labelPosition,
              { disabled: disabled.value }
            ])}
            onTap={(event: ITouchEvent) => {
              if (props.labelDisabled) {
                preventDefault(event, true)
              }
            }}
          >
            {slots.default()}
          </view>
        )
      }
    }

    return () => {
      const nodes: (JSX.Element | undefined)[] = props.labelPosition === 'left' ? [renderLabel(), renderIcon()] : [renderIcon(), renderLabel()]
      return (
        <view
          role={props.role}
          class={props.bem([
            {
              disabled: disabled.value,
              'label-disabled': props.labelDisabled
            },
            direction.value
          ])}
          onTap={onTap}
        >
          {nodes}
        </view>
      )
    }
  }
})
