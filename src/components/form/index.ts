import type { App } from 'vue'

import { withInstall } from '../utils'
import _Form from './Form'
import _Field from './Field'

import './index.less'

export const Field = withInstall(_Field)

export const Form = withInstall(_Form, { Field })

Form.install = (app: App) => {
  app.component(Field.name, Field)
  app.component(Form.name, Form)
}

export default Form

export * from './types'
export type { FormProps } from './Form'
