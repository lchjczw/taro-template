import { withInstall } from '../utils'
import _Popup from './Popup'

import './index.less'

export const Popup = withInstall(_Popup)
export default Popup

export { popupProps } from './Popup'
export type { PopupProps } from './Popup'

export * from './types'
export * from './utils'
