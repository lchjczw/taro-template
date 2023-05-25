import type {
  CascaderOption,
  CascaderTab,
  CascaderFieldNames
} from './types'

import { ScrollView } from '@tarojs/components'
import { Icon } from '@/components/icon'

import {
  Popup,
  popupSharedProps,
  popupSharedPropKeys
} from '../popup'

import Bem from '@txjs/bem'
import extend from 'extend'
import { pick } from '@txjs/shared'
import { getRect, nextTick as taroNextTick } from '@/utils'
import { useId } from '../composables'

import {
  defineComponent,
  ref,
  watch,
  nextTick,
  type PropType
} from 'vue'

import {
  truthProp,
  numericProp,
  makeArrayProp,
} from '../utils'

const cascaderProps = extend({}, popupSharedProps, {
  title: String,
  value: numericProp,
  round: truthProp,
  closeable: truthProp,
  closeOnPopstate: truthProp,
  safeAreaInsetBottom: truthProp,
  subTitles: Array as PropType<string[]>,
  options: makeArrayProp<CascaderOption>(),
  fieldNames: Object as PropType<CascaderFieldNames>,
  onClickTab: Function as PropType<(tabIndex: number) => void>,
  onChange: Function as PropType<(params: {
    tabIndex: number
    value: Numeric
    selectedOptions: Array<CascaderOption>
  }) => void>,
  onFinish: Function as PropType<(params: {
    tabIndex: number
    value: Numeric
    selectedOptions: Array<CascaderOption>
  }) => void>,
  'onUpdate:value': Function as PropType<(value: Numeric) => void>,
  'onUpdate:show': Function as PropType<(value: boolean) => void>
})

const DefaultOptionLabel = '选择选项'

const popupPropsKeys = [
  ...popupSharedPropKeys,
  'round',
  'closeable',
  'safeAreaInsetBottom'
] as const

const [name, bem] = Bem('cascader')

export default defineComponent({
  name,

  props: cascaderProps,

  setup(props, { slots, emit }) {
    const tabs = ref<CascaderTab[]>([])
    const scrollTopList = ref<number[]>([])
    const activeTab = ref(0)

    const menuId = useId()

    const {
      text: textKey,
      value: valueKey,
      children: childrenKey
    } = extend({
      text: 'text',
      value: 'value',
      children: 'children'
    }, props.fieldNames)

    const updateShow = (show: boolean) => emit('update:show', show)

    const getSelectedOptionsByValue = (
      options: CascaderOption[],
      value: Numeric
    ): CascaderOption[] | undefined => {
      for (const option of options) {
        if (option[valueKey] === value) {
          return [option]
        }

        if (option[childrenKey]) {
          const selectedOptions = getSelectedOptionsByValue(
            option[childrenKey],
            value
          )

          if (selectedOptions) {
            return [option, ...selectedOptions]
          }
        }
      }
    }

    const onSelect = (
      option: CascaderOption,
      tabIndex: number
    ) => {
      if (option.disabled) {
        return
      }

      tabs.value[tabIndex].selected = option

      if (tabs.value.length > tabIndex + 1) {
        tabs.value = tabs.value.slice(0, tabIndex + 1)
        scrollTopList.value = scrollTopList.value.slice(0, tabIndex + 1)
      }

      if (option[childrenKey]) {
        const nextTab = {
          options: option[childrenKey],
          selected: null
        }

        if (tabs.value[tabIndex + 1]) {
          tabs.value[tabIndex + 1] = nextTab
        } else {
          tabs.value.push(nextTab)
        }

        nextTick(() => {
          activeTab.value++
        })
      }

      updateScrollTop()

      const selectedOptions = tabs.value
        .map((tab) => tab.selected!)
        .filter(Boolean)

      emit('update:value', option[valueKey])

      const params = {
        tabIndex,
        selectedOptions,
        value: option[valueKey]
      }

      props.onChange?.(params)

      if (!option[childrenKey]) {
        updateShow(false)
        props.onFinish?.(params)
      }
    }

    const onClickTab = (tabIndex: number) => {
      activeTab.value = tabIndex
      updateScrollTop()
      props.onClickTab?.(tabIndex)
    }

    const onReset = () => {
      tabs.value = []
      scrollTopList.value = []
      activeTab.value = 0
    }

    const updateTabs = () => {
      const { options, value } = props

      if (value !== undefined) {
        const selectedOptions = getSelectedOptionsByValue(options, value)

        if (selectedOptions) {
          let optionsCursor = options

          tabs.value = selectedOptions.map((option) => {
            const tab = {
              options: optionsCursor,
              selected: option,
            }

            const next = optionsCursor.find(
              (item) => item[valueKey] === option[valueKey]
            )

            if (next) {
              optionsCursor = next[childrenKey]
            }

            return tab
          })

          if (optionsCursor) {
            tabs.value.push({
              options: optionsCursor,
              selected: null
            })
          }

          nextTick(() => {
            activeTab.value = tabs.value.length - 1
            updateScrollTop()
          })
          return
        }
      }

      tabs.value = [
        {
          options,
          selected: null
        }
      ]
    }

    const updateScrollTop = () => {
      const { options, selected } = tabs.value[activeTab.value]

      if (selected) {
        taroNextTick(async () => {
          const rect = await getRect(`.${menuId}`)

          if (rect) {
            const eachRadioHeight = rect.height / options.length
            scrollTopList.value[activeTab.value] = eachRadioHeight * options.findIndex((option) => option[valueKey] === selected[valueKey])
          }
        })
      }
    }

    const renderTitle = () => {
      if (slots.title || props.title) {
        return (
          <view class={bem('title')}>
            {slots.title ? slots.title() : props.title}
          </view>
        )
      }
    }

    const renderTab = (tab: CascaderTab, index: number) => {
      const { selected } = tab
      const title = selected ? selected[textKey] : DefaultOptionLabel
      const active = !!selected
      const last = tabs.value.length - 1 === index

      return (
        <view
          class={bem('tab')}
          onTap={() => onClickTab(index)}
        >
          <view class={bem('tab-dot', { active, last })} />
          <view class={bem('tab-label', { active: index === activeTab.value })}>
            <text>{title}</text>
          </view>
          <Icon
            name="arrow"
            size={32}
            class={bem('tab-arrow')}
          />
        </view>
      )
    }

    const renderOptionsTitle = () => {
      if (props.subTitles && props.subTitles[activeTab.value]) {
        return (
          <view class={bem('options-title')}>
            {props.subTitles[activeTab.value]}
          </view>
        )
      }
    }

    const renderOption = (
      option: CascaderOption,
      selectedOption: CascaderOption | null,
      tabIndex: number
    ) => {
      const { disabled } = option
      const selected = !!(
        selectedOption && option[valueKey] === selectedOption[valueKey]
      )

      return (
        <view
          key={option[valueKey]}
          role="menuitemradio"
          class={[bem('option', { selected, disabled }), option.className]}
          aria-checked={selected}
          aria-disabled={disabled || undefined}
          onTap={() => onSelect(option, tabIndex)}
        >
          {slots.option ? slots.option({ option, selected }): (
            <text>{option[textKey]}</text>
          )}
          {selected && (
            <Icon
              name="success"
              size={40}
              class={bem('selected-icon')}
            />
          )}
        </view>
      )
    }

    const renderOptions = (
      options: CascaderOption[],
      selectedOption: CascaderOption | null,
      tabIndex: number
    ) => (
      <ScrollView
        scrollY
        enhanced
        pagingEnabled
        showScrollbar={false}
        scrollTop={tabIndex === activeTab.value ? scrollTopList.value[tabIndex] : 0}
        class={bem('options')}
      >
        <view
          role="menu"
          class={tabIndex === activeTab.value ? menuId : undefined}
        >
          {options.map((option) => renderOption(option, selectedOption, tabIndex))}
        </view>
      </ScrollView>
    )

    watch(
      () => props.options,
      updateTabs,
      { deep: true }
    )

    watch(
      () => props.show,
      (value) => {
        if (value) {
          updateTabs()
        }
      },
      { immediate: true }
    )

    watch(
      () => props.value,
      (value) => {
        if (value !== undefined) {
          const values = tabs.value.map((tab) => tab.selected?.[valueKey])
          if (values.includes(value)) {
            return
          }
          updateTabs()
        } else {
          onReset()
        }
      }
    )

    return () => (
      <Popup
        class={bem()}
        position="bottom"
        onUpdate:show={props['onUpdate:show'] || updateShow}
        {...pick(props, popupPropsKeys)}
      >
        {renderTitle()}
        <view class={bem('content')}>
          <view class={[bem('tabs'), 'hairline--bottom']}>
            {tabs.value.map(renderTab)}
          </view>
          {renderOptionsTitle()}
          <view
            class={bem('options-container')}
            style={{
              width: `${tabs.value.length + 1}00vw`,
              transform: `translateX(-${activeTab.value}00vw)`
            }}
          >
            {tabs.value.map(({ options, selected }: CascaderTab, tabIndex) => renderOptions(options, selected, tabIndex))}
          </view>
        </view>
      </Popup>
    )
  }
})

