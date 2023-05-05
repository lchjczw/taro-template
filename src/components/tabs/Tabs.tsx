import { TAB_NAME_KEY } from './Tab'

import {
  ScrollView,
  type ITouchEvent
} from '@tarojs/components'

import Bem from '@txjs/bem'
import extend from 'extend'
import { isNil } from '@txjs/bool'
import { callInterceptor, type Interceptor } from '@txjs/shared'
import { useChildren, useId } from '../composables'

import {
  defineComponent,
  reactive,
  computed,
  watch,
  type ComputedRef,
  type VNode,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes,
  type InjectionKey
} from 'vue'

import {
  addUnit,
  nextTick,
  getRect,
  getAllRect
} from '@/utils'

import {
  truthProp,
  makeNumberProp,
  makeNumericProp
} from '../utils'

const [name, bem] = Bem('tabs')

const tabsProps = {
  border: Boolean,
  ellipsis: truthProp,
  indicator: truthProp,
  value: makeNumericProp(0),
  swipeThreshold: makeNumberProp(4),
  duration: makeNumericProp(300),
  beforeChange: Function as PropType<Interceptor>,
  lineStyle: Object as PropType<CSSProperties>,
  'onUpdate:value': Function as PropType<(value: Numeric) => void>,
  onClickTab: Function as PropType<(options: {
    name: Numeric,
    title?: string
    disabled: boolean
    event: ITouchEvent
  }) => void>,
  onChange: Function as PropType<(options: {
    name: Numeric,
    title?: string
  }) => void>
}

export type TabsProps = ExtractPropTypes<typeof tabsProps>

export type TabsProvide = {
  id: string
  props: TabsProps
  scrollable: ComputedRef<boolean>
  update(name: Numeric): void
}

export const TABS_KEY: InjectionKey<TabsProvide> = Symbol(name)

function filterChildren(children: VNode[] = []) {
  return children.filter((child) => (child.type as any).unique_name === TAB_NAME_KEY)
}

export default defineComponent({
  name,

  props: tabsProps,

  setup(props, { slots, emit }) {
    const id = useId()
    const { children, linkChildren } = useChildren(TABS_KEY)

    const state = reactive({
      ready: false,
      index: -1,
      offsetLeft: 0,
      lineStyle: {} as CSSProperties
    })

    const duration = computed(() =>
      state.ready ? props.duration : 0
    )

    const scrollable = computed(() =>
      children.length > props.swipeThreshold || !props.ellipsis
    )

    const indicator = computed(() =>
      props.indicator && state.index !== -1
    )

    const clickTab = async (name: Numeric) => {
      const index = children.findIndex((child) => child.identifies.value === name)

      if (index !== -1) {
        const tabItem = children[index]
        const [root, rectAll] = await Promise.all([
          getRect(`#${id}`),
          getAllRect(`.${tabItem.id.value}`)
        ])

        if (isNil(root) || !rectAll.length) {
          return
        }

        const lineStyle = {} as CSSProperties

        const rect = rectAll[index]
        const rectOffsetLeft = rectAll
          .slice(0, index)
          .reduce(
            (prev, curr) => prev += Math.abs(curr.width), 0
          )

        if (props.indicator) {
          lineStyle.transitionDuration = `${duration.value}ms`
          lineStyle.transform = `translateX(${addUnit(rectOffsetLeft + (rect.width / 2) + (props.ellipsis ? 8 : 0), 2)}) translateX(-50%)`
        }

        state.index = index
        state.offsetLeft = rectOffsetLeft - ((root.width - rect.width) / 2)
        state.lineStyle = lineStyle

        return tabItem
      }
    }

    const update = (name: Numeric) => {
      if (isNil(name) || props.value === name) {
        return
      }

      callInterceptor(props.beforeChange, {
        args: [name],
        done: () => {
          emit('update:value', name)
        }
      })
    }

    const renderIndicator = () => {
      if (indicator.value && state.ready) {
        return (
          <view
            class={bem('line')}
            style={extend(props.lineStyle, state.lineStyle)}
          />
        )
      }
    }

    watch(
      () => props.value,
      async (value) => {
        const curr = await clickTab(value)
        if (curr) {
          props.onChange?.({
            name: curr.identifies.value,
            title: curr.title
          })
        }
      }
    )

    watch(
      () => children.length,
      () => {
        if (!state.ready) {
          nextTick(() => {
            clickTab(props.value)
            state.ready = true
          })
        }
      }
    )

    linkChildren({ props, id, scrollable, update })

    return () => (
      <view
        class={[
          bem({ scrollable: scrollable.value }),
          { 'hairline--bottom': props.border }
        ]}
      >
        <ScrollView
          enhanced
          scrollWithAnimation
          scrollX={scrollable.value}
          scrollY={false}
          showScrollbar={false}
          scrollLeft={state.offsetLeft}
          scrollAnimationDuration={`${duration.value}ms`}
          style={{ height: '100%' }}
        >
          <view
            id={id}
            class={bem('wrapper')}
          >
            {filterChildren(slots.default?.())}
            {renderIndicator()}
          </view>
        </ScrollView>
      </view>
    )
  }
})
