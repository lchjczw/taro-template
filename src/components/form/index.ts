import type { App } from 'vue'

import { withInstall } from '../utils'
import _Form from './Form'
import _Field from './Field'

import './index.less'

const Field = withInstall<typeof _Field>(_Field)

_Form.Field = Field

const Form = withInstall<typeof _Form & {
  readonly Field: typeof Field
}>(_Form)

Form.install = (app: App) => {
  app.component(Field.name, Field)
  app.component(Form.name, Form)
}

export * from './types'

export type { FormProps } from './Form'
export { Form, Field }

export default Form
