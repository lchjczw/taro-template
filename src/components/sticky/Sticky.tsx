import { APP_GLOBAL_KEY } from '../app/App'

import Bem from '@txjs/bem'
import extend from 'extend'
import { usePageScroll } from '@tarojs/taro'
import { isNil, isFunction } from '@txjs/bool'
import { addUnit, getRect } from '@/utils'
import { useId } from '../composables'

import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  inject,
  type PropType,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'

import {
  truthProp,
  numericProp,
  makeNumericProp,
  getZIndexStyle
} from '../utils'

const [name, bem] = Bem('sticky')

export type StickyScrollOptions = {
  scrollTop: number
  height: number
  isFixed: boolean
}

export const stickyProps = {
  zIndex: numericProp,
  safearea: truthProp,
  offsetTop: makeNumericProp(0),
  container: Function as PropType<() => Taro.NodesRef>,
  onScroll: Function as PropType<(options: StickyScrollOptions) => void>,
  onChange: Function as PropType<(isFixed: boolean) => void>
}

export type StickyProps = ExtractPropTypes<typeof stickyProps>

export default defineComponent({
  name,

  props: stickyProps,

  setup(props, { slots }) {
    const innerScrollTop = ref(0)
    const state = reactive({
      fixed: false,
      height: 0,
      transform: 0,
      offsetTop: 0
    })

    const id = useId()
    const app = inject(APP_GLOBAL_KEY)

    const offsetTop = computed(() => {
      let offset = parseFloat(props.offsetTop.toString())

      if (isNaN(offset)) {
        offset = 0
      }

      if (props.safearea && app?.navbarOptions.height) {
        offset += app?.navbarOptions.height
      }
      return offset
    })

    const rootStyle = computed(() => {
      const style = {} as CSSProperties

      if (state.fixed) {
        extend(style, { height: addUnit(state.height, 2) })
      }

      return style
    })

    const stickyStyle = computed(() => {
      const style = {} as CSSProperties

      if (state.fixed) {
        extend(style, getZIndexStyle(props.zIndex), {
          height: addUnit(state.height, 2),
          top: addUnit(offsetTop.value, 2)
        })

        if (state.transform) {
          style.transform = `translate3d(0, ${state.transform}px, 0)`
        }
      }

      return style
    })

    const getContainerRect = () => {
      const nodesRef = props.container!()
      return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>(
        (resolve) => nodesRef.boundingClientRect().exec((rect: any = []) => {
          return resolve(rect[0])
        })
      )
    }

    const setDataAfterDiff = (data: Record<string, any>) => {
      const diff = Object.keys(data)
        .reduce(
          (ret, key) => {
            if (data[key] !== state[key as keyof typeof state]) {
              ret[key] = data[key]
            }
            return ret
          }, {} as Record<string, any>
        )

      if (Object.keys(diff).length > 0) {
        extend(state, diff)
      }

      props.onScroll?.({
        scrollTop: innerScrollTop.value,
        height: state.height,
        isFixed: state.fixed
      })
    }

    const onScroll = (scrollTop: number) => {
      innerScrollTop.value = scrollTop || innerScrollTop.value

      if (isFunction(props.container)) {
        Promise.all([
          getRect(`#${id}`),
          getContainerRect()
        ])
          .then(([root, container]) => {
            if (root && container) {
              if (offsetTop.value + root.height > container.top + container.height) {
                setDataAfterDiff({
                  fixed: false,
                  transform: container.height - root.height
                })
              } else if (offsetTop.value > root.top) {
                setDataAfterDiff({
                  fixed: true,
                  height: root.height,
                  transform: 0
                })
              } else {
                setDataAfterDiff({
                  fixed: false,
                  transform: 0
                })
              }
            }
          })
        return
      }

      getRect(`#${id}`)
        .then((rect) => {
          if (isNil(rect)) {
            return
          }
          if (offsetTop.value > rect.top) {
            setDataAfterDiff({
              fixed: true,
              height: rect.height
            })
          } else {
            setDataAfterDiff({
              fixed: false
            })
          }
        })
    }

    watch(
      () => state.fixed,
      (value) => props.onChange?.(value)
    )

    usePageScroll(({ scrollTop }) => onScroll(scrollTop))

    return () => (
      <view
        id={id}
        style={rootStyle.value}
      >
        <view
          class={bem({ fixed: state.fixed })}
          style={stickyStyle.value}
        >
          {slots.default?.()}
        </view>
      </view>
    )
  }
})
