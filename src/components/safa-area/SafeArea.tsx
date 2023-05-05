import Bem from '@txjs/bem'
import { addUnit, getSystemInfoSync } from '@/utils'
import { truthProp, makeStringProp } from '../utils'

import {
  defineComponent,
  computed,
  type CSSProperties
} from 'vue'

type SafeAreaPosition = 'top' | 'bottom'

const [name] = Bem('safe-area')

const safaAreaProps = {
  show: truthProp,
  position: makeStringProp<SafeAreaPosition>('bottom')
}

const {
  hasSafeArea,
  safeArea,
  screenHeight,
  statusBarHeight = 0
} = getSystemInfoSync()

export default defineComponent({
  name,

  props: safaAreaProps,

  setup(props, { slots }) {
    const visible = computed(() => {
      switch (props.position) {
        case 'bottom':
          return hasSafeArea
        case 'top':
          return statusBarHeight != 0
        default:
          return false
      }
    })

    return () => {
      if (!props.show) {
        return
      }

      if (visible.value) {
        const style = {} as CSSProperties

        if (props.position === 'bottom') {
          style.paddingBottom = addUnit(screenHeight - safeArea!.bottom, 2)
        } else if (props.position === 'top') {
          style.paddingTop = addUnit(statusBarHeight, 2)
        }

        return (
          <view style={style} />
        )
      }

      return slots.default?.()
    }
  }
})
