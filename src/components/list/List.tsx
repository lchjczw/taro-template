import { Loading } from '../loading'
import { Result } from '../result'

import Bem from '@txjs/bem'
import { noop } from '@txjs/shared'
import { nextTick, getSystemInfoSync } from '@/utils'
import { useId, useExpose } from '../composables'

import {
  defineComponent,
  ref,
  watch,
  onUpdated,
  type PropType,
  type ExtractPropTypes
} from 'vue'

import {
  createSelectorQuery,
  useLoad,
  usePageScroll,
  useReachBottom
} from '@tarojs/taro'

import {
  makeArrayProp,
  makeStringProp,
  makeNumericProp
} from '../utils'

const [name, bem] = Bem('list')

const listProps = {
  error: Boolean,
  loading: Boolean,
  finished: Boolean,
  immediateCheck: Boolean,
  data: makeArrayProp(),
  errorText: makeStringProp('请求失败，点击重新加载'),
  loadingText: makeStringProp('加载中'),
  finishedText: makeStringProp('已经到底了'),
  offset: makeNumericProp(50),
  onLoad: Function as PropType<() => void>,
  'onUpdate:error': Function as PropType<(value: unknown) => void>,
  'onUpdate:loading': Function as PropType<(value: unknown) => void>
}

export type ListProps = ExtractPropTypes<typeof listProps>

export type ListProvide = {
  check: () => void
}

export default defineComponent({
  name,

  props: listProps,

  setup(props, { slots, emit }) {
    const scrollTop = ref(0)
    const loading = ref(props.loading)

    const placeholderId = useId()
    const selector = createSelectorQuery()
    const cilentHeight = getSystemInfoSync().safeArea?.height ?? 0

    selector
      .select(`.${placeholderId}`)
      .boundingClientRect()

    const check = () => {
      nextTick(() => {
        if (
          loading.value ||
          props.finished ||
          props.error
        ) {
          return
        }

        selector.exec(([{ bottom = 0 }] = []) => {
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
          if ((cilentHeight + scrollTop.value >= bottom - +props.offset) && !loading.value) {
            loading.value = true
            emit('update:loading', true)
            props.onLoad?.()
          }
        })
      })
    }

    const onClickErrorText = () => {
      emit('update:error', false)
      check()
    }

    const renderFinishedText = () => {
      if (!props.finished) {
        return
      }

      if (props.data.length === 0) {
        return (
          <Result
            status="nodata"
            title={noop}
            desc="暂无数据"
          />
        )
      }

      if (slots.finished || props.finishedText) {
        return (
          <view class={bem('finished-text')}>
            {slots.finished?.() || props.finishedText}
          </view>
        )
      }
    }

    const renderErrorText = () => {
      if (!props.error) {
        return
      }

      if (slots.error || props.errorText) {
        return (
          <view
            class={bem('error-text')}
            onTap={onClickErrorText}
          >
            {slots.error?.() || props.errorText}
          </view>
        )
      }
    }

    const renderLoading = () => {
      if (loading.value && !props.finished) {
        return (
          <view class={bem('loading')}>
            {slots.loading?.() || (
              <Loading size={32}>
                {props.loadingText}
              </Loading>
            )}
          </view>
        )
      }
    }

    watch(
      () => [props.loading, props.finished, props.error],
      check
    )

    useExpose({ check })

    onUpdated(() => {
      loading.value = props.loading
    })

    useLoad(() => {
      if (props.immediateCheck) {
        check()
      }
    })

    usePageScroll((payload) => {
      scrollTop.value = payload.scrollTop
    })

    useReachBottom(check)

    return () => (
      <view
        role="feed"
        class={bem()}
        aria-busy={loading.value}
      >
        {slots.default?.()}
        {renderLoading()}
        {renderFinishedText()}
        {renderErrorText()}
        <view class={[bem('placeholder'), placeholderId]} />
      </view>
    )
  }
})
