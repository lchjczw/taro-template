import type { Interceptor } from '@txjs/shared'

export type RouterPath = string

export type RouterQuery = string | Record<string, any>

export type RouterOption<T = RouterPath> = {
  path: T,
  query?: RouterQuery,
  beforeEnter?: Interceptor
}
