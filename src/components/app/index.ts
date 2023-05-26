import { withInstall } from '../utils'
import _App from './App'
import _Body from './Body'

import './index.less'

export const Body = withInstall(_Body)
export const App = withInstall(_App, { Body })
export default App

export type { AppInstance } from './App'
