import { withInstall } from '../utils'
import _Timer from './Timer'
import _Button from './Button'

import './index.less'

export const Timer = withInstall(_Timer)
export const Button = withInstall(_Button, { Timer })
export default Button

export * from './utils'
