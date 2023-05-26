import type { App } from 'vue'

import { withInstall } from '../utils'
import _Row from './Row'
import _Col from './Col'

import './index.less'

export const Col = withInstall(_Col)
export const Row = withInstall(_Row, { Col })

Row.install = (app: App) => {
  app.component(Row.name, Row)
  app.component(Col.name, Col)
}

export default Row
