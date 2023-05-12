import type { NavbarPosition, NavbarTitleColor } from './types'

import { APP_GLOBAL_KEY } from '../app/App'
import { Icon } from '../icon'

import Bem from '@txjs/bem'
import { debounce } from 'debounce'
import { isFunction } from '@txjs/bool'
import { jump } from '@/router'
import { useId } from '../composables'

import {
  defineComponent,
  ref,
  reactive,
  computed,
  inject,
  watch,
  type PropType,
  type CSSProperties
} from 'vue'

import {
  getCurrentInstance,
  getCurrentPages,
  useLoad,
  usePageScroll
} from '@tarojs/taro'

import {
  noop,
  callInterceptor,
  type Interceptor
} from '@txjs/shared'

import {
  getAppConfig,
  addUnit,
  nextTick,
  getRect,
  getSystemInfoSync
} from '@/utils'

import {
  truthProp,
  makeStringProp,
  makeNumericProp,
  getZIndexStyle,
  type VueSlotVNode
} from '../utils'

const navbarProps = {
  border: Boolean,
  titleClass: String,
  leftClass: String,
  fixed: truthProp,
  placeholder: truthProp,
  showHomeIcon: Boolean,
  scrollTransition: Boolean,
  transposeColor: Boolean,
  safeAreaInsetTop: truthProp,
  leftArrowNoPaddingLeft: Boolean,
  zIndex: makeNumericProp(999),
  position: makeStringProp<NavbarPosition>('center'),
  background: makeStringProp('#ffffff'),
  backBefore: Function as PropType<Interceptor>,
  title: [String, Function] as PropType<string | VueSlotVNode>,
  titleColor: makeStringProp<NavbarTitleColor>('black'),
}

const [name, bem] = Bem('navbar')

export default defineComponent({
  name,

  props: navbarProps,

  setup(props, { slots }) {
    const opacity = ref(
      props.scrollTransition ? 0 : 1
    )

    const id = useId()
    const app = inject(APP_GLOBAL_KEY)
    const history = getCurrentPages().length > 1

    const { pages } = getAppConfig()
    const { page } = getCurrentInstance()
    const { statusBarHeight = 0 } = getSystemInfoSync()

    const titleColor = computed(() =>
      app?.navbarOptions.titleColor ||
      page?.config?.navigationBarTextStyle ||
      props.titleColor
    )

    const state = reactive({
      height: 0,
      color: titleColor.value as string | NavbarTitleColor,
      leftArrowVisible: !app?.hasTabbar && (history || props.showHomeIcon)
    })

    const showLeft = computed(() =>
      !!slots.left || state.leftArrowVisible
    )

    const background = computed(() =>
      app?.navbarOptions.background || props.background
    )

    const titleText = computed(() =>
      props.title || app?.navbarOptions.title
    )

    const navbarStyle = computed(() => {
      const style = getZIndexStyle(props.zIndex) as CSSProperties
      if (props.safeAreaInsetTop) {
        style.paddingTop = addUnit(statusBarHeight, 2)
      }
      return style
    })

    const leftStyle = computed(() => {
      const style = {} as CSSProperties
      if (props.leftArrowNoPaddingLeft) {
        style.paddingLeft = '0rpx'
      }
      return style
    })

    const getRootHeight = () => {
      nextTick(async () => {
        const rect = await getRect(`#${id}`)

        if (rect) {
          state.height = rect.height
          app?.update({
            navbarOptions: {
              height: rect.height
            }
          })
        }
      })
    }

    const getTransparencyColor = (opacity: number) => {
      if (titleColor.value === 'white') {
        return `rgba(0,0,0,${opacity})`
      }
      return `rgba(255,255,255,${opacity})`
    }

    const setOpacity = debounce(
      (scrollTop: number) => {
        const rate = +Number(scrollTop / 0).toFixed(2)
        let color: string | NavbarTitleColor = titleColor.value

        if (props.transposeColor && rate > 0.1) {
          color = getTransparencyColor(rate)
        }

        state.color = color
        opacity.value = rate > 1 ? 1 : rate
      }, 10, true
    )

    const onBack = () => {
      callInterceptor(props.backBefore, {
        done: () => {
          if (history) {
            jump.navigateBack(1)
          } else {
            jump.reLaunch(pages![0])
          }
        }
      })
    }

    watch(
      () => titleColor.value,
      (value) => {
        state.color = value
      }
    )

    usePageScroll(({ scrollTop }) => {
      if (props.scrollTransition) {
        setOpacity(scrollTop)
      }
    })

    useLoad(getRootHeight)

    const renderLeftIcon = () => {
      if (showLeft.value) {
        return (
          <view
            class={[bem('left'), props.leftClass]}
            style={leftStyle.value}
          >
            {slots.left?.() || state.leftArrowVisible && (
              <Icon
                size={40}
                name={history ? 'arrow-left' : 'wap-home-o'}
                color={state.color}
                class={bem('left-icon')}
                onTap={onBack}
              />
            )}
          </view>
        )
      }
    }

    const renderTitleText = (title: typeof titleText.value) => {
      if (title) {
        if (isFunction(title)) {
          return title() || (
            <text>{app?.navbarOptions.title}</text>
          )
        }
        return (
          <text>{titleText.value}</text>
        )
      }
    }

    const renderTitle = () => {
      const title = slots.default || titleText.value

      if (title) {
        return (
          <view
            class={[bem('title', { 'noLeft': !showLeft.value && !props.leftArrowNoPaddingLeft }), props.titleClass]}
            style={{ color: state.color }}
          >
            {slots.default?.() || renderTitleText(titleText.value)}
          </view>
        )
      }
    }

    const renderPlaceholder = () => {
      if (props.fixed && props.placeholder) {
        return (
          <view style={{ height: addUnit(state.height, 2) }} />
        )
      }
    }

    const renderNavbar = () => (
      <view
        catchMove
        id={id}
        class={bem({
          fixed: props.fixed,
          border: props.border,
          [props.position]: true
        })}
        style={navbarStyle.value}
        onTouchMove={noop}
      >
        <view
          class={bem('placeholder')}
          style={{
            opacity: opacity.value,
            background: background.value
          }}
        />
        <view class={bem('wrapper')}>
          {process.env.TARO_ENV !== 'alipay' && renderLeftIcon()}
          {renderTitle()}
        </view>
      </view>
    )

    return () => [
      renderPlaceholder(),
      renderNavbar()
    ]
  }
})
