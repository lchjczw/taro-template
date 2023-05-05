import { withInstall } from '../utils'
import _Keyboard from './Keyboard'

import './index.less'

export const Keyboard = withInstall<typeof _Keyboard>(_Keyboard)

export type { KeyboardChangeDetails, KeyboardInstance } from './Keyboard'

export default Keyboard
