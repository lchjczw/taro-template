import type { App } from 'vue'

import { withInstall } from '../utils'
import _Cell from './Cell'
import _Group from './Group'

import './index.less'

export const CellGroup = withInstall(_Group)
export const Cell = withInstall(_Cell, { CellGroup })

Cell.install = (app: App) => {
  app.component(CellGroup.name, CellGroup)
  app.component(Cell.name, Cell)
}

export default Cell

export { cellSharedProps } from './Cell'
