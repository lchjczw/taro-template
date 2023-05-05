import { withInstall } from '../utils'
import _Overlay from './Overlay'

import './index.less'

export const Overlay = withInstall<typeof _Overlay>(_Overlay)

export { overlaySharedProps } from './Overlay'

export type { OverlayProps } from './Overlay'

export default Overlay
