import { Button } from '@/components/button'

import {
  Popup,
  popupSharedProps,
  popupSharedPropKeys
} from '../popup'

import Bem from '@txjs/bem'
import extend from 'extend'
import { pick } from '@txjs/shared'
import { nextTick } from '@/utils'
import { truthProp, makeArrayProp } from '../utils'

import {
  defineComponent,
  type ExtractPropTypes,
  type PropType
} from 'vue'

const [name, bem] = Bem('action-sheet')

export type ActionSheetOption = {
  title?: string
  color?: string
  label?: string
  loading?: boolean
  disabled?: boolean
  callback?: (option: ActionSheetOption) => void
  className?: unknown
}

export const actionSheetProps = extend({}, popupSharedProps, {
  title: String,
  round: truthProp,
  actions: makeArrayProp<ActionSheetOption>(),
  closeable: Boolean,
  cancelText: String,
  description: String,
  closeOnPopstate: truthProp,
  closeOnClickAction: Boolean,
  safeAreaInsetBottom: truthProp,
  onSelect: Function as PropType<(option: ActionSheetOption, index: number) => void>,
  onCancel: Function as PropType<() => void>,
  'onUpdate:show': Function as PropType<(value: boolean) => void>
})

export type ActionSheetProps = ExtractPropTypes<typeof actionSheetProps>

const popupPropsKeys = [
  ...popupSharedPropKeys,
  'closeable',
  'round',
  'closeOnPopstate',
  'safeAreaInsetBottom'
] as const

export default defineComponent({
  name,

  props: actionSheetProps,

  setup(props, { slots, emit }) {
    const updateShow = (show: boolean) => emit('update:show', show)

    const onCancel = () => {
      updateShow(false)
      props.onCancel?.()
    }

    const renderTitle = () => {
      if (props.title) {
        return (
          <view class={bem('title')}>
            <text>{props.title}</text>
          </view>
        )
      }
    }

    const renderDescription = () => {
      if (slots.description || props.description) {
        return (
          <view class={bem('description')}>
            {slots.description?.() || props.description}
          </view>
        )
      }
    }

    const renderCancel = () => {
      if (slots.cancel || props.cancelText) {
        return (
          <>
            <view class={bem('gap')} />
            <Button
              block
              bold={false}
              size="large"
              class={bem('cancel')}
              onTap={onCancel}
            >
              {slots.cancel?.() || props.cancelText}
            </Button>
          </>
        )
      }
    }

    const renderOptionContent = (option: ActionSheetOption, index: number) => {
      if (slots.option) {
        return slots.option({ option, index })
      }

      return (
        <>
          <text>{option.title}</text>
          {option.label ? (
            <view class={bem('option-label')}>{option.label}</view>
          ) : null}
        </>
      )
    }

    const renderOption = (option: ActionSheetOption, index: number) => {
      const { color, loading, disabled, className, callback } = option

      const onTap = () => {
        if (loading || disabled) {
          return
        }

        if (callback) {
          callback(option)
        }

        if (props.closeOnClickAction) {
          updateShow(false)
        }

        nextTick(() => props.onSelect?.(option, index))
      }

      return (
        <Button
          block
          bold={false}
          disabled={disabled}
          loading={loading}
          size="large"
          iconPosition="right"
          class={[bem('option', { unclickable: loading || disabled }), className]}
          style={{ color }}
          onTap={onTap}
        >
          {renderOptionContent(option, index)}
        </Button>
      )
    }

    return () => (
      <Popup
        class={bem()}
        position="bottom"
        onUpdate:show={props['onUpdate:show'] || updateShow}
        {...pick(props, popupPropsKeys)}
      >
        {renderTitle()}
        {renderDescription()}
        <view class={bem('content')}>
          {props.actions.map(renderOption)}
          {slots.default?.()}
        </view>
        {renderCancel()}
      </Popup>
    )
  }
})
