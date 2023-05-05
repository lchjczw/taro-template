import { withInstall } from '../utils'
import _Cover from './Cover'

import './index.less'

export const Cover = withInstall<typeof _Cover>(_Cover)

export default Cover
