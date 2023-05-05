import { type App } from 'vue'
import { withInstall } from '../utils'
import _Row from './Row'
import _Col from './Col'

import './index.less'

const Col = withInstall<typeof _Col>(_Col)

_Row.Col = Col

const Row = withInstall<typeof _Row & {
  readonly Col: typeof Col
}>(_Row)

Row.install = (app: App) => {
  app.component(Row.name, Row)
  app.component(Col.name, Col)
}

export { Row, Col }
export default Row
