import { withInstall } from '../utils'
import _Timer from './Timer'
import _Button from './Button'

import './index.less'

const Timer = withInstall<typeof _Timer>(_Timer)

_Button.Timer = Timer

const Button = withInstall<typeof _Button & {
  readonly Timer: typeof Timer
}>(_Button)

export * from './utils'

export { Button, Timer }

export default Button
