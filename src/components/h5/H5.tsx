import Bem from '@txjs/bem'
import { previewImage } from '@tarojs/taro'
import { useEvents } from '@/hooks'
import { useExpose } from '../composables'
import { truthProp } from '../utils'

import {
  defineComponent,
  ref,
  onUnmounted,
  type ExtractPropTypes,
  type ComponentPublicInstance
} from 'vue'

import {
  isString,
  isValidString,
  notNil
} from '@txjs/bool'

interface TaroElement extends HTMLElement {
  h5tagName: string
}

const [name, bem] = Bem('h5')

const h5Props = {
  imageFull: truthProp,
  onTap: Function
}

export type H5Props = ExtractPropTypes<typeof h5Props>

export type H5Provide = {
  parse: (value: string) => void
}

export type H5Instace = ComponentPublicInstance<H5Props, H5Provide>

/**
 * HTML属性转换
 */
function setAttribute(attributes: NamedNodeMap, element: HTMLElement, keys: string[] = []) {
  for (const key in attributes) {
    let { name, value } = attributes[key]

    if (keys.includes(name)) {
      continue
    }

    let newValue: any

    switch (value) {
      case 'false':
        newValue = false
        break
      case 'true':
        newValue = true
        break
      default:
        newValue = value
    }

    element.setAttribute(name, newValue)
  }
  return element as TaroElement
}

export default defineComponent({
  name,

  props: h5Props,

  setup(props) {
    const html = ref()

    const parse = (value: string) => {
      if (isString(value) && value.trim() !== '') {
        html.value = value
      }
    }

    const images = [] as string[]
    const events = [] as [TaroElement, (() => void)][]

    useEvents.von('h5-transform-element', (taroElement: TaroElement, parent: TaroElement) => {
      taroElement.setAttribute('class', bem(taroElement.h5tagName || taroElement.nodeName))

      if (notNil(taroElement.parentElement)) {
        // @ts-ignore
        parent = taroElement.parentElement
      }

      switch (taroElement.h5tagName) {
        case 'table':
          const $tableView = document.createElement('view')
          $tableView.setAttribute('class', bem('view'))
          $tableView.setAttribute('class', bem('table-container'))
          $tableView.appendChild(taroElement)
          parent?.appendChild($tableView)
          break
        case 'img':
          const $imgSrc = taroElement.getAttribute('src')

          // 检查src是否有效
          if (isValidString($imgSrc)) {
            images.push($imgSrc)
          }

          const $event = () => {
            props.onTap?.(taroElement.h5tagName, { $imgSrc })
            if (props.imageFull && isValidString($imgSrc)) {
              previewImage({
                current: $imgSrc,
                urls: images
              })
            }
          }

          taroElement.setAttribute('mode', 'widthFix')
          taroElement.addEventListener('tap', $event)
          events.push([taroElement, $event])
          break
        case 'video':
          const $videoView = document.createElement('view')
          const $video = document.createElement('video')
          setAttribute(taroElement.attributes, $video)
          console.log($video)
          $videoView.setAttribute('class', bem('video-container'))
          $videoView.appendChild($video)
          parent.removeChild(taroElement)
          parent?.appendChild($videoView)
          break
        case 'a':
          const $aNavigator = document.createElement('navigator')
          const $aHref = taroElement.getAttribute('href') || ''
          $aNavigator.setAttribute('class', bem('a-container'))
          $aNavigator.setAttribute('url', $aHref)
          $aNavigator.appendChild(taroElement)
          parent?.appendChild(setAttribute(taroElement.attributes, $aNavigator, ['class']))
          break
      }
    })

    useExpose({ parse })

    onUnmounted(() => {
      if (events.length) {
        events.forEach(([taroElement, event], index) => {
          taroElement.removeEventListener('tap', event)
          events.splice(index, 1)
        })
        events.splice(0, events.length)
      }
    })

    return () => (
      <view class={bem()}>
        <view
          class={[bem('body'), '__h5-component-tag']}
          v-html={`<main>${html.value || ''}</main>`}
        />
      </view>
    )
  }
})
