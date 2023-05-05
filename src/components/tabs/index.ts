import type { App } from 'vue'

import { withInstall } from '../utils'
import _Tabs from './Tabs'
import _Tab from './Tab'

import './index.less'

const Tab = withInstall<typeof _Tab>(_Tab)

_Tabs.Item = Tab

const Tabs = withInstall<typeof _Tabs & {
  readonly Item: typeof Tab
}>(_Tabs)

Tabs.install = (app: App) => {
  app.component(Tab.name, Tab)
  app.component(Tabs.name, Tabs)
}

export { Tab, Tabs }
export default Tabs
