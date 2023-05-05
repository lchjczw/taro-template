import { withInstall } from '../utils'
import _Icon from './Icon'

import './index.less'

export const Icon = withInstall<typeof _Icon>(_Icon)

export type { IconName } from './types'

export default Icon
