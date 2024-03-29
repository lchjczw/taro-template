import type { CheckerDirection } from '../checkbox/Checker'
import type { CheckboxGroupProvide, CheckboxGroupToggleAllOptions } from './types'

import Bem from '@txjs/bem'
import { isBoolean } from '@txjs/bool'
import { numericProp, makeArrayProp } from '../utils'

import {
  defineComponent,
  watch,
  type PropType,
  type InjectionKey,
  type ExtractPropTypes
} from 'vue'

import {
  useChildren,
  useFieldValue,
  useExpose
} from '../composables'

const [name, bem] = Bem('checkbox-group')

export const checkboxGroupProps = {
  max: numericProp,
  disabled: Boolean,
  iconSize: numericProp,
  checkedColor: String,
  direction: String as PropType<CheckerDirection>,
  value: makeArrayProp<unknown>(),
  onChange: Function as PropType<(value: unknown[]) => void>,
  'onUpdate:value': Function as PropType<(value: unknown[]) => void>
}

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>

export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupProvide> = Symbol(name)

export default defineComponent({
  name,

  props: checkboxGroupProps,

  setup(props, { emit, slots }) {
    const { children, linkChildren } = useChildren(CHECKBOX_GROUP_KEY)

    const updateValue = (value: unknown[]) => emit('update:value', value)

    const toggleAll = (options: CheckboxGroupToggleAllOptions = {}) => {
      if (isBoolean(options)) {
        options = { checked: options }
      }

      const { checked, skipDisabled } = options
      const checkedChildren = children.filter((item) => {
        if (!item.props.bindGroup) {
          return false
        }
        if (item.props.disabled && skipDisabled) {
          return item.checked.value
        }
        return checked ?? !item.checked.value
      })

      const names = checkedChildren.map((item) => item.name)
      updateValue(names)
    }

    watch(
      () => props.value,
      (value) => props.onChange?.(value)
    )

    useExpose({ toggleAll })

    useFieldValue(() => props.value)

    linkChildren({ props, updateValue })

    return () => (
      <view class={bem([props.direction])}>
        {slots.default?.()}
      </view>
    )
  }
})
