import { withInstall } from '../utils'
import _Keyboard from './Keyboard'

import './index.less'

export const Keyboard = withInstall(_Keyboard)
export default Keyboard

export type { KeyboardChangeDetails, KeyboardInstance } from './Keyboard'
