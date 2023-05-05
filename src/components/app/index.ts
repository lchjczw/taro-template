import { withInstall } from '../utils'
import _App from './App'
import _Body from './Body'

import './index.less'

const Body = withInstall<typeof _Body>(_Body)

_App.Body = Body

const App = withInstall<typeof _App & {
  readonly Body: typeof Body
}>(_App)

export type { AppInstance } from './App'

export { App, Body }

export default App
