import type { App } from 'vue'

import { withInstall } from '../utils'
import _Checkbox from './Checkbox'
import _Group from './Group'

import './index.less'

const CheckboxGroup = withInstall<typeof _Group>(_Group)

_Checkbox.Group = CheckboxGroup

const Checkbox = withInstall<typeof _Checkbox & {
  readonly Group: typeof CheckboxGroup
}>(_Checkbox)

Checkbox.install = (app: App) => {
  app.component(CheckboxGroup.name, CheckboxGroup)
  app.component(Checkbox.name, Checkbox)
}

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

export { CheckboxGroup, Checkbox }
export default Checkbox
