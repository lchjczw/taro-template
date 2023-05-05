import type { VueSlotVNode } from '../utils'
import type { ResultOption, ResultProps } from './types'

import { Button } from '../button'

import Bem from '@txjs/bem'
import extend from 'extend'
import { pick } from '@txjs/shared'
import { isPlainObject, isFunction } from '@txjs/bool'

import {
  defineComponent,
  reactive,
  watch,
  unref,
  onMounted,
  type PropType
} from 'vue'

export const resultSharedProps = {
  refresh: Function as PropType<() => void>,
  status: {
    type: [String, Object] as PropType<ResultProps>,
    default: null
  }
}

const resultProps = extend({}, resultSharedProps, {
  image: [String, Function] as PropType<string | VueSlotVNode>,
  title: [String, Function] as PropType<string | VueSlotVNode>,
  desc: [String, Function] as PropType<string | VueSlotVNode>,
  bottom: Function as PropType<VueSlotVNode>
})

const [name, bem] = Bem('result')

export default defineComponent({
  name,

  props: resultProps,

  setup(props, { slots }) {
    const state = reactive<ResultOption>({
      status: undefined,
      image: props.image,
      title: props.title,
      bottom: props.bottom,
      desc: props.desc,
      refresh: props.refresh
    })

    const merge = (...args: ResultOption[]) => extend(state, ...args)

    const getNode = (vnode?: string | VueSlotVNode | null) => isFunction(vnode) ? vnode() : vnode

    const widghtButton = () => (
      <Button
        round
        bold={false}
        width={200}
        size="small"
        type="primary"
        onTap={() => state.refresh?.()}
      >刷新</Button>
    )

    const renderImage = () => {
      const image = slots.image || state.image
      const node = getNode(image)

      if (node) {
        return (
          <view class={bem('image')}>
            {isFunction(image) ? node : <image src={node as string} />}
          </view>
        )
      }
    }

    const renderTitle = () => {
      const title = getNode(slots.title || state.title)

      if (title) {
        return (
          <view class={bem('title')}>{title}</view>
        )
      }
    }

    const renderDesc = () => {
      const desc = getNode(slots.desc || state.desc)

      if (desc) {
        return (
          <view class={bem('desc')}>{desc}</view>
        )
      }
    }

    const renderBottom = () => {
      const bottom = slots.default || state.bottom

      if (bottom) {
        return (
          <view class={bem('bottom')}>{bottom()}</view>
        )
      }
    }

    const withStatus = (
      status: string,
      options: ResultOption = {}
    ) => {
      const defaultOptions = {} as ResultOption

      if (['500', 'error'].includes(status)) {
        defaultOptions.bottom = widghtButton
      }

      switch (status) {
        case 'nodata':
          extend(defaultOptions, {
            title: '暂无数据',
            image: require(`./image/${process.env.TARO_ENV}/no-data.png`)
          })
          break
        case '404':
          extend(defaultOptions, {
            title: '接口不存在或已删除！',
            image: require(`./image/${process.env.TARO_ENV}/404.png`)
          })
          break
        case '500':
          extend(defaultOptions, {
            title: '抱歉，服务器请求异常！',
            desc: '别紧张，试试看刷新页面~',
            image: require(`./image/${process.env.TARO_ENV}/500.png`),
            button: widghtButton
          })
          break
        case 'network':
          extend(defaultOptions, {
            title: '网络异常，请检查网络连接！',
            image: require(`./image/${process.env.TARO_ENV}/no-network.png`)
          })
          break
        case 'error':
        default:
          extend(defaultOptions, {
            title: '抱歉，页面加载发生错误！',
            desc: '别紧张，试试看刷新页面~',
            image: require(`./image/${process.env.TARO_ENV}/500.png`),
            button: widghtButton
          })
      }

      merge(defaultOptions, options)
    }

    const updateStatus = () => {
      const original = props.status

      if (isPlainObject(original)) {
        const { status, ...other } = original

        if (status) {
          withStatus(status, other)
        } else {
          merge(other)
        }
      } else {
        withStatus(original)
      }

      merge(
        pick(unref(props), [
          'image',
          'title',
          'desc',
          'bottom',
          'refresh'
        ], true)
      )
    }

    watch(
      () => props.status,
      updateStatus
    )

    onMounted(updateStatus)

    return () => (
      <view class={bem()}>
        {renderImage()}
        {renderTitle()}
        {renderDesc()}
        {renderBottom()}
      </view>
    )
  }
})
