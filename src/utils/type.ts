export function makeString(): string | undefined
export function makeString<T>(defaultVal?: T): T
export function makeString<T>(defaultVal: string): string | T
export function makeString(defaultVal?: string) {
  return defaultVal
}

export function makeStringMap<T = string[]>(...keys: Array<keyof T>) {
  return keys.reduce(
    (maps, curr) => {
      maps[curr] = makeString()
      return maps
    }, {} as Record<keyof T, string | undefined>
  )
}

export function makeNumber(): number | undefined
export function makeNumber(defaultVal: number): number
export function makeNumber(defaultVal?: number) {
  return defaultVal
}

export function makeNumberMap<T = string[]>(...keys: Array<keyof T>) {
  return keys.reduce(
    (maps, curr) => {
      maps[curr] = makeNumber()
      return maps
    }, {} as Record<keyof T, number | undefined>
  )
}

export function makeNumeric(): Numeric | undefined
export function makeNumeric(defaultVal: Numeric): Numeric
export function makeNumeric(defaultVal?: Numeric) {
  return defaultVal
}

export function makeArray<T = any>(): T[] | undefined
export function makeArray<T = any>(defaultArr: T[]): T[]
export function makeArray<T = any>(defaultArr?: T[]) {
  return defaultArr
}
