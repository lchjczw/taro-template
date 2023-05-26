import type { App } from 'vue'

import { withInstall } from '../utils'
import _Group from './Group'
import _Radio from './Radio'

import './index.less'

export const RadioGroup = withInstall(_Group)
export const Radio = withInstall(_Radio, { RadioGroup })

Radio.install = (app: App) => {
  app.component(RadioGroup.name, RadioGroup)
  app.component(Radio.name, Radio)
}

export default Radio

export { radioGroupProps } from './Group'
export { radioProps } from './Radio'

export type { RadioGroupProps } from './Group'
export type { RadioProps, RadioShape, RadioLabelPosition } from './Radio'
