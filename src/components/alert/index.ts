import { withInstall } from '../utils'
import _Alert from './Alert'

import './index.less'

export const Alert = withInstall<typeof _Alert>(_Alert)

export default Alert
