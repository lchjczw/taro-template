import { SafeArea } from '../safa-area'

import Bem from '@txjs/bem'
import { defineComponent, ref, onUnmounted } from 'vue'
import { useLoad } from '@tarojs/taro'
import { getRect, nextTick } from '@/utils'
import { useId } from '../composables'

import {
  truthProp,
  makeNumericProp,
  getZIndexStyle
} from '../utils'

const [name, bem] = Bem('footer-bar')

export default defineComponent({
  name,

  props: {
    zIndex: makeNumericProp(899),
    placeholder: truthProp,
    safeAreaInsetBottom: truthProp
  },

  setup(props, { slots }) {
    const id = useId()
    const height = ref(0)

    const updateHeight = () => {
      nextTick(async () => {
        const rect = await getRect(`#${id}`)
        if (rect) {
          height.value = rect.height
        }
      })
    }

    const observer = new MutationObserver(updateHeight)

    useLoad(() => {
      updateHeight()
      nextTick(() => {
        observer.observe(document.getElementById(id)!, {
          childList: true
        })
      })
    })

    onUnmounted(() => {
      if (observer) {
        observer.takeRecords()
        observer.disconnect()
      }
    })

    return () => (
      <>
        {props.placeholder ? (
          <view style={{ height: `${height.value}px` }} />
        ) : null}
        <view
          id={id}
          class={bem()}
          style={getZIndexStyle(props.zIndex)}
        >
          {slots.default?.()}
          <SafeArea show={props.safeAreaInsetBottom}>
            <view class={bem('bottom')} />
          </SafeArea>
        </view>
      </>
    )
  }
})
