import { APP_GLOBAL_KEY } from '../app/App'

import Bem from '@txjs/bem'
import { notNil } from '@txjs/bool'
import { addUnit, makeStringDef } from '@/utils'
import { coverImage } from './extra'

import {
  defineComponent,
  ref,
  watch,
  computed,
  inject,
  watchEffect,
  type PropType,
  type CSSProperties
} from 'vue'

import {
  numericProp,
  makeStringProp,
  makeNumericProp
} from '../utils'

type CoverPositionText = 'absolute' | 'relative'

type Colors = Record<typeof process.env.TARO_ENV, string>

const [name, bem] = Bem('cover')

const colors = {
  weapp: 'linear-gradient(137deg, #00d89f 8%, #00af66 85%, #00af66 85%)',
  alipay: 'linear-gradient(137deg, #4A91F4 0%, #1677FF 100%, #1677FF 100%)'
} as Colors

const coverProps = {
  height: numericProp,
  position: makeStringProp<CoverPositionText>('absolute'),
  image: makeStringProp(coverImage),
  maxHeight: makeNumericProp(300),
  background: {
    type: Object as PropType<Colors | null>,
    value: colors
  }
}

export default defineComponent({
  name,

  props: coverProps,

  setup(props) {
    const app = inject(APP_GLOBAL_KEY)
    const background = ref(
      makeStringDef()
    )

    const imageStyle = computed(() => {
      const style = {} as CSSProperties
      if (props.height) {
        style.height = addUnit(props.height)
      }
      return style
    })

    watchEffect(() => {
      if (notNil(props.background)) {
        background.value = props.background[process.env.TARO_ENV]
      }
    })

    watch(
      () => background.value,
      (value, oldValue) => {
        if (value !== oldValue) {
          app?.update({
            navbarOptions: {
              background: value
            }
          })
        }
      },
      { immediate: true }
    )

    return () => (
      <view
        class={bem([props.position])}
        style={{
          height: addUnit(props.maxHeight),
          background: background.value
        }}
      >
        <image
          class={bem('image')}
          src={props.image}
          style={imageStyle.value}
        />
      </view>
    )
  }
})
