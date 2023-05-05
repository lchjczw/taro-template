import type { App } from 'vue'
import type { CustomShim } from './types'

import { camelize } from '@/utils'

type EventShim = CustomShim<{
  onClick?: Callback
}>

export type WithInstall<T,> = T & EventShim & {
  install(app: App): void
}

export const componentCustomOptions = <T, U>(opts: any) => {
  return opts as T & CustomShim<U>
}

export const withInstall = <T,>(options: any) => {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options
    app.component(camelize(name), options)
  }
  return options as WithInstall<T>
}
