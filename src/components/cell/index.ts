import type { App } from 'vue'

import { withInstall } from '../utils'
import _Cell from './Cell'
import _Group from './Group'

import './index.less'

const CellGroup = withInstall<typeof _Group>(_Group)

_Cell.Group = CellGroup

const Cell = withInstall<typeof _Cell & {
  readonly Group: typeof CellGroup
}>(_Cell)

Cell.install = (app: App) => {
  app.component(CellGroup.name, CellGroup)
  app.component(Cell.name, Cell)
}

export { cellSharedProps } from './Cell'
export { CellGroup, Cell }
export default Cell
