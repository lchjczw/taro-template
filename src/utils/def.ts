export function makeStringDef(): string | undefined
export function makeStringDef<T>(defaultVal?: T): T
export function makeStringDef<T>(defaultVal: string): string | T
export function makeStringDef(defaultVal?: string) {
  return defaultVal
}

export function makeStringMap<T = string[]>(...keys: Array<keyof T>) {
  return keys.reduce(
    (maps, curr) => {
      maps[curr] = makeStringDef()
      return maps
    }, {} as Record<keyof T, string | undefined>
  )
}

export function makeNumberDef(): number | undefined
export function makeNumberDef(defaultVal: number): number
export function makeNumberDef(defaultVal?: number) {
  return defaultVal
}

export function makeNumberMap<T = string[]>(...keys: Array<keyof T>) {
  return keys.reduce(
    (maps, curr) => {
      maps[curr] = makeNumberDef()
      return maps
    }, {} as Record<keyof T, number | undefined>
  )
}

export function makeNumericDef(): Numeric | undefined
export function makeNumericDef(defaultVal: Numeric): Numeric
export function makeNumericDef(defaultVal?: Numeric) {
  return defaultVal
}

export function makeArrayDef<T = any>(): T[] | undefined
export function makeArrayDef<T = any>(defaultArr: T[]): T[]
export function makeArrayDef<T = any>(defaultArr?: T[]) {
  return defaultArr
}
