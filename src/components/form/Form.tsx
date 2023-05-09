import type {
  FormProvide,
  FieldTextAlign,
  FieldValidateError,
  FieldValidateTrigger,
  FieldValidationStatus
} from './types'

import { Form, type ITouchEvent } from '@tarojs/components'

import Bem from '@txjs/bem'
import { isString } from '@txjs/bool'
import { useChildren, useExpose } from '../composables'

import {
  defineComponent,
  type PropType,
  type InjectionKey,
  type ExtractPropTypes
} from 'vue'

import {
  numericProp,
  truthProp,
  preventDefault
} from '../utils'

const [name, bem] = Bem('form')

const formProps = {
  colon: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  showError: Boolean,
  shrink: truthProp,
  titleWidth: numericProp,
  scrollToError: Boolean,
  validateFirst: Boolean,
  showErrorMessage: truthProp,
  rules: Object as PropType<Record<string, ValidatorRules>>,
  titleAlign: String as PropType<FieldTextAlign>,
  inputAlign: String as PropType<FieldTextAlign>,
  errorMessageAlign: String as PropType<FieldTextAlign>,
  onReset: Function as PropType<() => void>,
  onFinish: Function as PropType<(values: Record<string, unknown>) => void>,
  onFailed: Function as PropType<(evt: { errors: FieldValidateError[],  values: Record<string, unknown> }) => void>,
  validateTrigger: {
    type: [String, Array] as PropType<FieldValidateTrigger | FieldValidateTrigger[]>,
    default: 'onBlur'
  }
}

export type FormProps = ExtractPropTypes<typeof formProps>

export const FORM_KEY: InjectionKey<FormProvide> = Symbol(name)

export default defineComponent({
  name,

  inheritAttrs: false,

  props: formProps,

  setup(props, { slots, attrs }) {
    const { children, linkChildren } = useChildren(FORM_KEY)

    const getFieldsByNames = (names?: string[]) => {
      if (names) {
        return children.filter((field) => names.includes(field.name))
      }
      return children
    }

    const validateSeq = (names?: string[]) => {
      return new Promise<void>((resolve, reject) => {
        const errors: FieldValidateError[] = []
        const fields = getFieldsByNames(names)

        fields
          .reduce(
            (promise, field) =>
              promise.then(() => {
                if (!errors.length) {
                  return field
                    .validate()
                    .then((error?: FieldValidateError) => {
                      if (error) {
                        errors.push(error)
                      }
                    })
                }
              }),
            Promise.resolve()
          )
          .then(() => {
            if (errors.length) {
              reject(errors)
            } else {
              resolve()
            }
          })
      })
    }

    const validateAll = (names?: string[]) => {
      return new Promise<void>((resolve, reject) => {
        const fields = getFieldsByNames(names)

        Promise
          .all(fields.map((field) => field.validate()))
          .then((errors) => {
            errors = errors.filter(Boolean)

            if (errors.length) {
              reject(errors)
            } else {
              resolve()
            }
          })
      })
    }

    const validateField = (name: string) => {
      const matched = children.find((item) => item.name === name)

      if (matched) {
        return new Promise<void>((resolve, reject) => {
          matched
            .validate()
            .then((error?: FieldValidateError) => {
              if (error) {
                reject(error)
              } else {
                resolve()
              }
            })
        })
      }

      return Promise.reject()
    }

    const validate = (name?: string | string[]) => {
      if (isString(name)) {
        return validateField(name)
      }
      return props.validateFirst ? validateSeq(name) : validateAll(name)
    }

    const getValidationStatus = () =>
      children.reduce((form, field) => {
        form[field.name] = field.getValidationStatus()
        return form
      }, {} as Record<string, FieldValidationStatus>)

    const scrollToField = (name: string) => {
      children.some((field) => {
        if (field.name === name) {
          field.scrollIntoView()
          return true
        }
        return false
      })
    }

    const getValues = () =>
      children
        .reduce(
          (form, field) => {
            form[field.name] = field.formValue.value
            return form
          }, {} as Record<string, unknown>
        )

    const reset = (name?: string | string[]) => {
      if (isString(name)) {
        name = [name]
      }

      const fields = getFieldsByNames(name)

      fields.forEach((field) => {
        field.resetValidation()
      })

      props.onReset?.()
    }

    const submit = () => {
      const values = getValues()

      validate()
        .then(() => props.onFinish?.(values))
        .catch((errors: FieldValidateError[]) => {
          props.onFailed?.({ errors, values })
          if (props.scrollToError && errors[0].name) {
            scrollToField
          }
        })
    }

    const onSubmit = (event: ITouchEvent) => {
      preventDefault(event)
      submit()
    }

    const onReset = (event: ITouchEvent) => {
      preventDefault(event)
      reset()
    }

    linkChildren({
      props,
      reset,
      submit,
      validate,
      getValues,
      scrollToField,
      getValidationStatus
    })

    useExpose({
      reset,
      submit,
      validate,
      getValues,
      scrollToField,
      getValidationStatus
    })

    return () => (
      <Form
        {...attrs}
        class={bem()}
        onSubmit={onSubmit}
        onReset={onReset}
      >
        {slots.default?.()}
      </Form>
    )
  }
})
