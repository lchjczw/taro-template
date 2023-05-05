import { withInstall } from '../utils'
import _FooterBar from './FooterBar'

import './index.less'

export const FooterBar = withInstall<typeof _FooterBar>(_FooterBar)

export default FooterBar
