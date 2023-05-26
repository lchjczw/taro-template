import type { App } from 'vue'

import { withInstall } from '../utils'
import _Checkbox from './Checkbox'
import _Group from './Group'

import './index.less'

export const CheckboxGroup = withInstall(_Group)

export const Checkbox = withInstall(_Checkbox, { CheckboxGroup })

Checkbox.install = (app: App) => {
  app.component(CheckboxGroup.name, CheckboxGroup)
  app.component(Checkbox.name, Checkbox)
}

export default Checkbox

export { checkboxGroupProps } from './Group'
export { checkboxProps } from './Checkbox'

export type { CheckboxProps } from './Checkbox'
export type { CheckboxGroupProps } from './Group'

export type {
 CheckboxShape,
 CheckboxInstance,
 CheckboxLabelPosition,
 CheckboxGroupDirection,
 CheckboxGroupToggleAllOptions,
 CheckboxGroupInstance
} from './types'
