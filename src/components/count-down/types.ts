import type { ComponentPublicInstance } from 'vue'
import type { CurrentTime } from '../composables'
import type { CountDownProps } from './CountDown'

type CountDownExpose = {
  start: () => void
  pause: () => void
  reset: () => void
}

export type CountDownInstance = ComponentPublicInstance<CountDownProps, CountDownExpose>

export type CountDownCurrentTime = CurrentTime
