import { withInstall } from '../utils'
import _Overlay from './Overlay'

import './index.less'

export const Overlay = withInstall(_Overlay)
export default Overlay

export { overlaySharedProps } from './Overlay'
export type { OverlayProps } from './Overlay'
