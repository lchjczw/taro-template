import type { NavbarTitleColor } from '../navbar/types'

import { resultSharedProps, type ResultProps } from '../result'
import { SafeArea } from '../safa-area'

import Bem from '@txjs/bem'
import extend from 'extend'
import { isNil } from '@txjs/bool'
import { noop } from '@txjs/shared'
import { useUserStore } from '@/stores'
import { router } from '@/router'
import { loading, checkTabbarRouter } from '@/utils'
import { STATE_KEY } from '@/hooks'
import { useParent, useExpose } from '../composables'
import { truthProp } from '../utils'

import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  provide,
  type ComputedRef,
  type CSSProperties,
  type InjectionKey,
  type ExtractPropTypes,
  type ComponentPublicInstance
} from 'vue'

import {
  useLoad,
  useRouter,
  useDidShow,
  useShareAppMessage
} from '@tarojs/taro'

const [name, bem] = Bem('app')

const appProps = extend({}, resultSharedProps, {
  inset: Boolean,
  loading: truthProp
})

export type AppProps = ExtractPropTypes<typeof appProps>

export type AppExpose = {
  updateRouterOptions(params: Record<string, any>): void
}

export type AppProvide = {
  bem: typeof bem
  props: AppProps,
  loading: ComputedRef<boolean>
  status: ComputedRef<ResultProps>
}

export type AppInstance = ComponentPublicInstance<AppProps, AppExpose>

export const APP_KEY: InjectionKey<AppProvide> = Symbol(name)

export type AppGlobal = {
  hasTabbar: boolean
  navbarOptions: {
    height?: number
    title?: string
    titleColor?: NavbarTitleColor
    background?: CSSProperties['background']
  },
  readonly update: (options: Partial<Omit<AppGlobal, 'update'>>) => void
}

export const APP_GLOBAL_KEY: InjectionKey<AppGlobal> = Symbol('app-global')

export default defineComponent({
  name,

  props: appProps,

  setup(props, { slots }) {
    const { path, params } = useRouter()

    const ready = ref(false)
    const routeMeta = ref(
      router.getRouteByMeta(path)
    )

    const app = reactive<AppGlobal>({
      hasTabbar: checkTabbarRouter(path),
      navbarOptions: {
        height: 0,
        title: routeMeta.value?.title,
        titleColor: undefined,
        background: undefined,
      },
      update: (options) => {
        extend(true, app, options)
      }
    })

    const { parent: state } = useParent(STATE_KEY)

    const innerLoading = computed(() =>
      state?.loading.value ?? props.loading
    )

    const innerStatus = computed(() =>
      state?.status.value ?? props.status
    )

    const safaArea = computed(() =>
      !app.hasTabbar && isNil(innerStatus.value)
    )

    const userStore = useUserStore()

    const updateRouterOptions = (options: Record<string, any> = {}) => {
      if (routeMeta.value?.beforeEnter) {
        routeMeta.value = routeMeta.value.beforeEnter({
          query: extend(params, options),
          options: routeMeta.value
        })
        app.navbarOptions.title = routeMeta.value.title
      }
    }

    // 加载状态控制
    const onLoading = (value: boolean) => {
      if (value) {
        app.navbarOptions.titleColor = 'black'
        loading.show()
      } else {
        app.navbarOptions.titleColor = undefined
        loading.hide()
      }
    }

    // 页面分享配置
    if (routeMeta.value?.shareMessage) {
      useShareAppMessage(routeMeta.value.shareMessage)
    }

    watch(
      () => innerLoading.value,
      onLoading
    )

    // 更新页面配置
    updateRouterOptions()

    // 更新用户store
    userStore.updateAll()

    provide(APP_KEY, {
      bem,
      props,
      status: innerStatus,
      loading: innerLoading
    })

    provide(APP_GLOBAL_KEY, app)

    useExpose({ updateRouterOptions })

    useLoad(() => {
      if (innerLoading.value) {
        onLoading(true)
      }
    })

    useDidShow(() => {
      if (ready.value) {
        userStore.updateAll()
      } else {
        ready.value = true
      }
    })

    const renderLoading = () => (
      <view
        catchMove
        // @ts-ignore
        disableScroll
        v-show={innerLoading.value}
        class={bem('loading')}
        /** @ts-ignore */
        onTouchmove={noop}
      />
    )

    return () => (
      <view class={bem('container')}>
        {renderLoading()}
        {slots.default?.()}
        <SafeArea show={safaArea.value}>
          <view class={bem('bottom')} />
        </SafeArea>
      </view>
    )
  }
})
