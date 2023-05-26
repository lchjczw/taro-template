import { Loading } from '../loading'
import { Icon } from '../icon'

import {
  Button,
  type ButtonProps,
  type ITouchEvent
} from '@tarojs/components'

import Bem from '@txjs/bem'
import extend from 'extend'
import { pick } from '@txjs/shared'
import { addUnit } from '@/utils'
import { preventDefault } from '../utils'
import { jumpLink, jumpLinkSharedProps } from '../mixins'
import { buttonProps } from './utils'

import {
  defineComponent,
  type PropType,
  type CSSProperties
} from 'vue'

const [name, bem] = Bem('button')

export default defineComponent({
  name,

  inheritAttrs: false,

  props: extend({}, jumpLinkSharedProps, buttonProps, {
    lang: String as PropType<ButtonProps['lang']>,
    sessionFrom: String as PropType<ButtonProps['sessionFrom']>,
    sendMessageTitle: String as PropType<ButtonProps['sendMessageTitle']>,
    sendMessagePath: String as PropType<ButtonProps['sendMessagePath']>,
    sendMessageImg: String as PropType<ButtonProps['sendMessageImg']>,
    publicId: String as PropType<ButtonProps['publicId']>,
    appParameter: String as PropType<ButtonProps['appParameter']>,
    showMessageCard: Boolean as PropType<ButtonProps['showMessageCard']>,
    scope: String as PropType<ButtonProps['scope']>,
    formType: String as PropType<ButtonProps['formType']>,
    openType: String as PropType<ButtonProps['openType']>,
    onGetUserInfo: Function as PropType<ButtonProps['onGetUserInfo']>,
    onGetAuthorize: Function as PropType<ButtonProps['onGetAuthorize']>,
    onContact: Function as PropType<ButtonProps['onContact']>,
    onGetPhoneNumber: Function as PropType<ButtonProps['onGetPhoneNumber']>,
    onError: Function as PropType<ButtonProps['onError']>,
    onOpenSetting: Function as PropType<ButtonProps['onOpenSetting']>,
    onLaunchApp: Function as PropType<ButtonProps['onLaunchApp']>,
    onChooseAvatar: Function as PropType<ButtonProps['onChooseAvatar']>,
    onFollowLifestyle: Function as PropType<ButtonProps['onFollowLifestyle']>
  }),

  setup(props, { attrs, slots }) {
    const renderText = () => {
      let text
      if (props.loading) {
        text = props.loadingText
      } else {
        text = slots.default?.() ?? props.text
      }

      if (text) {
        if (props.type === 'cell') {
          return text
        }

        return (
          <view class={bem('text')}>{text}</view>
        )
      }
    }

    const renderIcon = () => {
      if (props.loading) {
        return (
          <Loading class={bem('loading')} />
        )
      }

      if (slots.icon) {
        return (
          <view class={bem('icon')}>
            {slots.icon?.()}
          </view>
        )
      }

      if (props.icon) {
        return (
          <Icon
            size={props.iconSize}
            name={props.icon}
            class={bem('icon', [props.icon])}
          />
        )
      }
    }

    const getStyle = () => {
      const { color, plain, block, width } = props
      const style = {} as CSSProperties

      if (color) {
        style.color = plain ? 'color' : 'white'

        if (plain) {
          style.background = color
        }

        if (color.includes('gradient')) {
          style.border = 0
        } else {
          style.borderColor = color
        }
      }

      if (!block && width) {
        style.width = addUnit(width)
        style.display = 'flex'
      }

      return style
    }

    const onTap = (event: ITouchEvent) => {
      if (props.loading) {
        preventDefault(event)
      } else if (!props.disabled) {
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
    }

    return () => {
      const {
        type,
        size,
        bold,
        block,
        round,
        plain,
        square,
        loading,
        disabled,
        border,
        iconPosition
      } = props

      const classes = [
        bem([
          type,
          size,
          {
            bold,
            plain,
            block,
            round,
            square,
            loading,
            disabled,
            hairline: plain && border,
            unclickable: disabled || loading
          }
        ])
      ]

      const buttonProps = {
        ...attrs,
        ...pick(props, [
          'lang',
          'scope',
          'sessionFrom',
          'sendMessageImg',
          'sendMessagePath',
          'sendMessageTitle',
          'publicId',
          'hoverClass',
          'hoverStartTime',
          'hoverStayTime',
          'hoverStopPropagation',
          'appParameter',
          'showMessageCard',
          'openType',
          'formType',
          'onGetUserInfo',
          'onChooseAvatar',
          'onContact',
          'onError',
          'onFollowLifestyle',
          'onGetAuthorize',
          'onGetPhoneNumber',
          'onLaunchApp',
          'onOpenSetting'
        ]),
        onTap: onTap
      }

      return (
        <Button
          {...buttonProps}
          class={classes}
          hoverClass={bem('active')}
          style={getStyle()}
        >
          {iconPosition === 'left' && renderIcon()}
          {renderText()}
          {iconPosition === 'right' && renderIcon()}
        </Button>
      )
    }
  }
})
