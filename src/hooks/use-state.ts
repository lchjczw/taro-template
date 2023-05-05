import type { ResultProps, ResultOption } from '@/components/result'

import { toString, isString } from '@txjs/bool'
import { useChildren, useExpose } from '@/components/composables'

import {
  ref,
  type Ref,
  type InjectionKey
} from 'vue'

interface StateOption {
  loading?: boolean
  status?: ResultProps
}

export interface StateProvide {
  loading: Ref<boolean>
  status: Ref<ResultProps | undefined>
}

export const STATE_KEY: InjectionKey<StateProvide> = Symbol('use-state')

export const useState = (options?: StateOption) => {
  const loading = ref(options?.loading ?? true)
  const status = ref<ResultProps | undefined>(options?.status)
  const { linkChildren } = useChildren(STATE_KEY)

  const reload = (error: ResultOption, callback?: Callback) => {
    if (isString(error)) {
      error = {
        status: 'error',
        desc: error
      }
    } else if (toString(error) === 'Error') {
      error = {
        status: 'error',
        desc: (error as Error).message
      }
    }

    if (callback) {
      error.refresh = () => {
        loading.value = true
        status.value = undefined
        callback?.()
      }
    }

    status.value = error
  }

  const state = { loading, status, reload }

  linkChildren(state)
  useExpose(state)

  return state
}
