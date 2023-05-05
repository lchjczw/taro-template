import { Popup } from '../popup'

import Bem from '@txjs/bem'
import { vibrateShort } from '@tarojs/taro'
import { FIELD_INJECTION_KEY, useExpose } from '../composables'
import { makeNumericProp, makeStringProp } from '../utils'

import {
  defineComponent,
  ref,
  computed,
  inject,
  watch,
  onBeforeMount,
  type PropType,
  type TeleportProps,
  type CSSProperties,
  type ExtractPropTypes,
  type ComponentPublicInstance
} from 'vue'

import {
  INPUT_REGEXP,
  INPUT_VALUE,
  PROVINCE_DATA,
  ALPHANUMERIC_DATA,
  getKeyboardInput,
  type INPUT_REGEXP_TYPE,
  type INPUT_VALUE_TYPE
} from './utils'

interface KeyboardButtonOption {
  value: string
  type?: string
  disabled: boolean
}

export interface KeyboardChangeDetails {
  newEnergy: boolean
  value: string
  button?: string
  type?: INPUT_VALUE_TYPE
}

const keyboardProps = {
  show: Boolean,
  zIndex: makeNumericProp(901),
  value: makeStringProp(''),
  teleport: [String, Object] as PropType<TeleportProps['to']>,
  'onUpdate:value': Function as PropType<(value: string[]) => void>,
  'onUpdate:show': Function as PropType<(value: boolean) => void>,
  onClose: Function as PropType<() => void>,
  onChange: Function as PropType<(options: KeyboardChangeDetails) => void>
}

export type KeyboardProps = ExtractPropTypes<typeof keyboardProps>

export type KeyboardProvide = {
  update(value: string): void
}

export type KeyboardInstance = ComponentPublicInstance<KeyboardProps, KeyboardProvide>

const [name, bem] = Bem('keyboard')

export default defineComponent({
  name,

  props: keyboardProps,

  setup(props, { emit }) {
    const newEnergy = ref(false)
    const buttons = ref<KeyboardButtonOption[]>([])
    const focusInput = ref<INPUT_VALUE_TYPE>()
    const focusInputRegExp = ref<INPUT_REGEXP_TYPE>()
    const inputData = ref(
      getKeyboardInput()
    )

    const field = inject(FIELD_INJECTION_KEY, null)

    const inputStyle = computed(() => {
      const style = {} as CSSProperties
      if (props.show) {
        style.position = 'relative'
        style.zIndex = +props.zIndex + 1
      }
      return style
    })

    const inputValue = computed(() =>
      inputData.value.map((item) => item.value).join('')
    )

    const getButtons = (regExp: INPUT_REGEXP_TYPE) => {
      let buttons = [] as KeyboardButtonOption[]

      switch (regExp) {
        case INPUT_REGEXP.PROVINCE:
          buttons = PROVINCE_DATA.map((value) => ({
            value,
            disabled: false
          }))
          break
        case INPUT_REGEXP.ALPHA:
          buttons = ALPHANUMERIC_DATA.map((value) => ({
            value,
            disabled: /\d$/.test(value)
          }))
          break
        case INPUT_REGEXP.NOT_O:
          buttons = ALPHANUMERIC_DATA.map((value) => ({
            value,
            disabled: /O$/.test(value)
          }))
          break
      }

      return [
        ...buttons,
        {
          value: '删除',
          type: 'delete',
          disabled: inputValue.value == '' && focusInput.value === INPUT_VALUE.INPUT_1,
        },
        {
          value: '确定',
          type: 'confirm',
          disabled: false
        }
      ]
    }

    const onConfirm = () => {
      emit('update:show', false)
      focusInput.value = undefined
      focusInputRegExp.value = undefined
      props.onClose?.()
      field && field.validateWithTrigger('onBlur')
    }

    const onInputClick = (type: INPUT_VALUE_TYPE, regExp: INPUT_REGEXP_TYPE) => {
      if (focusInput.value !== type) {
        focusInput.value = type
        focusInputRegExp.value = regExp
        buttons.value = getButtons(regExp)
      }

      if (!props.show) {
        emit('update:show', true)
      }
    }

    const onButtonClick = (
      value: string,
      disabled: boolean,
      type?: string
    ) => {
      if (disabled || !focusInput.value) {
        return
      }

      vibrateShort({ type: 'light' })

      if (type === 'confirm') {
        onConfirm()
      } else {
        inputData.value.some((item, index) => {
          if (item.type === focusInput.value) {
            const options = {
              button: value,
              type: focusInput.value!,
              newEnergy: newEnergy.value
            }

            if (type === 'delete') {
              if (index === 0 && !item.value) {
                return true
              }

              if (focusInput.value === INPUT_VALUE.NEW_ENERGY) {
                options.newEnergy = false
              }

              index = index - 1
              item.value = ''
            } else {
              if (focusInput.value === INPUT_VALUE.NEW_ENERGY) {
                if (item.value === value) {
                  return true
                }

                options.newEnergy = true
              }

              index = index + 1
              item.value = value
            }

            newEnergy.value = options.newEnergy
            emit('update:value', inputValue.value)
            props.onChange?.({
              ...options,
              value: inputValue.value
            })

            const input = inputData.value[index]

            if (input) {
              onInputClick(input.type, input.RegExp)
            } else {
              buttons.value = getButtons(item.RegExp)
            }
            return true
          }
          return false
        })
      }
    }

    const update = (value?: string) => {
      if (value === inputValue.value) {
        return
      }

      if (value) {
        if (value.trim().length >= 7) {
          value
            .split('')
            .forEach((value, index) => {
              inputData.value[index].value = value
            })
          emit('update:value', inputValue.value)
          props.onChange?.({
            type: undefined,
            button: undefined,
            value: inputValue.value,
            newEnergy: value.length === 8
          })
        }
      } else {
        inputData.value = getKeyboardInput()
      }
    }

    watch(
      () => props.value,
      update
    )

    useExpose({ update })

    onBeforeMount(() => {
      update(props.value)
      buttons.value = getButtons(INPUT_REGEXP.PROVINCE)
    })

    return () => (
      <>
        <view
          class={bem('input')}
          style={inputStyle.value}
        >
          {inputData.value.map(({ type, value, RegExp, classes }) => (
            <view
              class={[bem('input-container', { focus: focusInput.value === type }), classes]}
              onTap={() => onInputClick(type, RegExp)}
            >
              <view class={bem('input-control')}>
                {value ? (
                  <text>{value}</text>
                ) : type === INPUT_VALUE.NEW_ENERGY ? (
                  <text class={bem('input-placeholder')}>新能源</text>
                ) : null}
              </view>
            </view>
          ))}
        </view>
        <Popup
          show={props.show}
          safeAreaInsetBottom
          position="bottom"
          zIndex={props.zIndex}
          teleport={props.teleport}
          overlayClass={bem('overlay')}
          class={bem('popup')}
          onClose={onConfirm}
          v-slots={{
            safearea: () => (
              <view class={bem('safearea')}></view>
            )
          }}
        >
          <view class={bem('container')}>
            <view class={bem()}>
              {buttons.value.map(({ disabled, value, type }) => (
                <view
                  class={[bem('button'), type]}
                  onTap={() => onButtonClick(value, disabled, type)}
                >
                  <view class={bem('button-inner', { disabled })}>
                    {type !== 'delete' ? (
                      <text>{value}</text>
                    ) : null}
                  </view>
                </view>
              ))}
            </view>
          </view>
        </Popup>
      </>
    )
  }
})
