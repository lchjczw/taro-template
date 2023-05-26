import type { App } from 'vue'

import { withInstall } from '../utils'
import _Tabs from './Tabs'
import _Tab from './Tab'

import './index.less'

export const Tab = withInstall(_Tab)
export const Tabs = withInstall(_Tabs, { Tab })

Tabs.install = (app: App) => {
  app.component(Tab.name, Tab)
  app.component(Tabs.name, Tabs)
}

export default Tabs
