import type { App } from 'vue'

import { withInstall } from '../utils'
import _Group from './Group'
import _Radio from './Radio'

import './index.less'

const RadioGroup = withInstall<typeof _Group>(_Group)

_Radio.Group = RadioGroup

const Radio = withInstall<typeof _Radio & {
  readonly Group: typeof RadioGroup
}>(_Radio)

Radio.install = (app: App) => {
  app.component(RadioGroup.name, RadioGroup)
  app.component(Radio.name, Radio)
}

export { radioGroupProps } from './Group'
export { radioProps } from './Radio'

export type { RadioGroupProps } from './Group'
export type {
  RadioProps,
  RadioShape,
  RadioLabelPosition
} from './Radio'

export { RadioGroup, Radio }
export default Radio
