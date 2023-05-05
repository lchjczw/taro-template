import type { ViewProps, ITouchEvent } from '@tarojs/components'
import type { PopupPosition, PopupCloseIconPosition } from './types'

import { SafeArea } from '../safa-area'
import { Overlay } from '../overlay'
import { Icon, type IconName } from '../icon'

import Bem from '@txjs/bem'
import extend from 'extend'
import { notNil } from '@txjs/bool'
import { noop, callInterceptor } from '@txjs/shared'
import { useLoad, useDidHide } from '@tarojs/taro'
import { useLazyRender, useExpose } from '../composables'
import { POPUP_TOGGLE_KEY, makeStringProp } from '../utils'
import { popupSharedProps } from './utils'

import {
  defineComponent,
  ref,
  watch,
  provide,
  Teleport,
  nextTick,
  computed,
  Transition,
  onActivated,
  onDeactivated,
  type CSSProperties,
  type ExtractPropTypes,
  type PropType
} from 'vue'

export const popupProps = extend({}, popupSharedProps, {
  round: Boolean,
  position: makeStringProp<PopupPosition>('center'),
  closeIcon: makeStringProp<IconName>('cross'),
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  closeOnPopstate: Boolean,
  closeIconPosition: makeStringProp<PopupCloseIconPosition>('top-right'),
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean,
  onOpen: Function as PropType<() => void>,
  onClose: Function as PropType<() => void>,
  'onUpdate:show': Function as PropType<(value: boolean) => void>,
  onClickOverlay: Function as PropType<ViewProps['onTap']>,
  onClickCloseIcon: Function as PropType<ViewProps['onTap']>,
  onOpened: Function as PropType<() => void>,
  onClosed: Function as PropType<() => void>
})

export type PopupProps = ExtractPropTypes<typeof popupProps>

const [name, bem] = Bem('popup')

export default defineComponent({
  name,

  inheritAttrs: false,

  props: popupProps,

  setup(props, { emit, attrs, slots }) {
    let opened: boolean
    let shouldReopen: boolean

    const zIndex = ref<number>()
    const popupRef = ref<HTMLElement>()

    const lazyRender = useLazyRender(() => props.show || !props.lazyRender)

    const style = computed(() => {
      const style: CSSProperties = {
        zIndex: zIndex.value
      }

      if (notNil(props.duration)) {
        const key = props.position === 'center' ? 'animationDuration' : 'transitionDuration'
        style[key] = `${props.duration}s`
      }

      return style
    })

    const open = () => {
      if (!opened) {
        opened = true
        zIndex.value = +props.zIndex
        props.onOpen?.()
      }
    }

    const close = () => {
      if (opened) {
        callInterceptor(props.beforeClose, {
          done() {
            opened = false
            props.onClose?.()
            emit('update:show', false)
          }
        })
      }
    }

    const onClickOverlay = (event: ITouchEvent) => {
      props.onClickOverlay?.(event)

      if (props.closeOnClickOverlay) {
        close()
      }
    }

    const renderOverlay = () => {
      if (props.overlay) {
        return (
          <Overlay
            v-slots={{ default: slots['overlay-content'] }}
            show={props.show}
            class={props.overlayClass}
            zIndex={zIndex.value}
            duration={props.duration}
            customStyle={props.overlayStyle}
            onTap={onClickOverlay}
          />
        )
      }
    }

    const onClickCloseIcon = (event: ITouchEvent) => {
      props.onClickCloseIcon?.(event)
      close()
    }

    const renderCloseIcon = () => {
      if (props.closeable) {
        return (
          <Icon
            name={props.closeIcon}
            class={bem('close-icon', props.closeIconPosition)}
            onTap={onClickCloseIcon}
          />
        )
      }
    }

    const onOpened = () => props.onOpened?.()
    const onClosed = () => props.onClosed?.()

    const renderPopup = lazyRender(() => {
      const { round, position, safeAreaInsetTop, safeAreaInsetBottom } = props

      return (
        <view
          {...attrs}
          catchMove
          v-show={props.show}
          ref={popupRef}
          style={style.value}
          class={bem({ round, [position]: position })}
          // @ts-ignore only alipay
          disableScroll={props.lockScroll}
          // @ts-ignore
          onTouchmove={noop}
        >
          <SafeArea
            position="top"
            show={safeAreaInsetTop}
          />
          {slots.default?.()}
          {renderCloseIcon()}
          <SafeArea show={safeAreaInsetBottom}>
            {slots.safearea?.()}
          </SafeArea>
        </view>
      )
    })

    const renderTransition = () => {
      const { position, transition, transitionAppear } = props
      const name = position === 'center' ? 'fade' : `${process.env.PREFIX}-popup-slide-${position}`

      return (
        <Transition
          v-slots={{ default: renderPopup }}
          name={transition || name}
          appear={transitionAppear}
          onAfterEnter={onOpened}
          onAfterLeave={onClosed}
        />
      )
    }

    watch(
      () => props.show,
      (show) => {
        if (show && !opened) {
          open()

          if (attrs.tabindex === 0) {
            nextTick(() => {
              popupRef.value?.focus()
            })
          }
        }
        if (!show && opened) {
          opened = false
          emit('close')
        }
      }
    )

    useExpose({ popupRef })

    provide(POPUP_TOGGLE_KEY, () => props.show)

    onActivated(() => {
      if (shouldReopen) {
        emit('update:show', true)
        shouldReopen = false
      }
    })

    onDeactivated(() => {
      if (props.show && props.teleport) {
        close()
        shouldReopen = true
      }
    })

    useLoad(() => {
      if (props.show) {
        open()
      }
    })

    useDidHide(() => {
      if (props.closeOnPopstate) {
        close()
        shouldReopen = false
      }
    })

    return () => {
      if (props.teleport) {
        return (
          <Teleport to={props.teleport}>
            {renderOverlay()}
            {renderTransition()}
          </Teleport>
        )
      }

      return (
        <>
          {renderOverlay()}
          {renderTransition()}
        </>
      )
    }
  },
})
