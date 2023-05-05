import type { ViewProps, ITouchEvent } from '@tarojs/components'
import type { CellSize, CellArrowDirection } from './types'

import { Icon, type IconName } from '../icon'

import Bem from '@txjs/bem'
import extend from 'extend'
import { isArray, notNil } from '@txjs/bool'
import { addUnit } from '@/utils'
import { useParent, useExpose } from '../composables'
import { jumpLinkSharedProps, jumpLink } from '../mixins'
import { CELL_GROUP_KEY } from './Group'

import {
  defineComponent,
  ref,
  computed,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

import {
  numericProp,
  truthProp,
  unknownProp
} from '../utils'

const [name, bem] = Bem('cell')

export const cellSharedProps = {
  icon: String as PropType<IconName>,
  size: String as PropType<CellSize>,
  title: numericProp,
  value: numericProp,
  label: numericProp,
  inset: truthProp,
  center: Boolean,
  isLink: Boolean,
  border: truthProp,
  required: Boolean,
  valueClass: unknownProp,
  labelClass: unknownProp,
  titleClass: unknownProp,
  titleWidth: numericProp,
  titleStyle: null as unknown as PropType<CSSProperties>,
  arrowDirection: String as PropType<CellArrowDirection>,
  onTap: Function as PropType<ViewProps['onTap']>,
  clickable: {
    type: Boolean as PropType<boolean | null>,
    default: null
  }
}

const callProps = extend({}, cellSharedProps, jumpLinkSharedProps)

export type CellProps = ExtractPropTypes<typeof callProps>
export type CellProvide = {
  setBorder(value: boolean): void
}

export default defineComponent({
  name,

  props: callProps,

  setup(props, { slots }) {
    const innerBorder = ref(props.border)
    const { parent } = useParent(CELL_GROUP_KEY)

    const titleWidth = computed(() =>
      props.titleWidth || parent?.props.titleWidth
    )

    const titleStyle = () => {
      const style = {} as CSSProperties

      if (titleWidth.value) {
        style.minWidth = addUnit(titleWidth.value)
        style.maxWidth = style.minWidth
      }

      if (props.titleStyle) {
        extend(style, props.titleStyle)
      }

      return style
    }

    const setBorder = (value: boolean) => {
      innerBorder.value = value
    }

    const onClick = (event: ITouchEvent) => {
      props.onTap?.(event)

      if (props.url) {
        jumpLink(
          props.url,
          props.linkQuery,
          props.linkType,
          props.linkBefore
        )
      }
    }

    useExpose({ setBorder })

    const renderLeftIcon = () => {
      if (slots.icon) {
        return slots.icon()
      }

      if (props.icon) {
        return (
          <Icon
            name={props.icon}
            class={bem('left-icon')}
          />
        )
      }
    }

    const renderLabel = () => {
      const showLabel = slots.label ?? notNil(props.label)

      if (showLabel) {
        return (
          <view class={[bem('label'), props.labelClass]}>
            {slots.label?.() ?? props.label}
          </view>
        )
      }
    }

    const renderTitle = () => {
      if (slots.title || notNil(props.title)) {
        const titleSlot = slots.title?.()

        if (isArray(titleSlot) && titleSlot.length === 0) {
          return
        }

        return (
          <view
            class={[bem('title'), props.titleClass]}
            style={titleStyle()}
          >
            {titleSlot || <text>{props.title}</text>}
            {renderLabel()}
          </view>
        )
      }
    }

    const renderValue = () => {
      const valueSlot = slots.value ?? slots.default
      const hasValue = valueSlot || notNil(props.value)

      if (hasValue) {
        return (
          <view class={[bem('value'), props.valueClass]}>
            {valueSlot?.() || <text>{props.value}</text>}
          </view>
        )
      }
    }

    const renderRightIcon = () => {
      if (slots['right-icon']) {
        return slots['right-icon']()
      }

      if (props.isLink) {
        const name = props.arrowDirection && props.arrowDirection !== 'right' ? `arrow-${props.arrowDirection}` : 'arrow'
        return (
          <Icon
            name={name as IconName}
            class={bem('right-icon')}
          />
        )
      }
    }

    return () => {
      const { size, center, inset, isLink, required } = props
      const border = innerBorder.value
      const clickable = props.clickable ?? isLink

      const classes: Record<string, boolean | undefined> = {
        center,
        inset,
        required,
        clickable,
        borderless: !border
      }

      if (size) {
        classes[size] = !!size
      }

      return (
        <view
          class={bem(classes)}
          hoverClass={bem('hover')}
          hoverStayTime={70}
          role={clickable ? 'button' : undefined}
          onTap={onClick}
        >
          {renderLeftIcon()}
          {renderTitle()}
          {renderValue()}
          {renderRightIcon()}
          {slots.extra?.()}
        </view>
      )
    }
  }
})
