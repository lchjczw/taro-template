declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'
declare module '*.json'

declare type Callback<T = any, U = void> = (...args: T[]) => U

declare type Numeric = number | string

declare type ReturnTypePromise<T extends Promise<any>> = T extends Promise<infer U> ? U: never

declare type ValidatorRules = any

declare type ObjectNonNullable<T> = {
  [p in keyof T]: NonNullable<T[p]>
}

declare type Writeable<T> = {
  -readonly [P in keyof T]: T[P]
}

declare type UserInfo = Record<string, any>

/** 当前运行环境提示 */
declare function runPrompt(): void
