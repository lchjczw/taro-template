import { withInstall } from '../utils'
import _Sticky from './Sticky'

import './index.less'

export const Sticky = withInstall<typeof _Sticky>(_Sticky)

export { stickyProps } from './Sticky'

export type { StickyScrollOptions, StickyProps } from './Sticky'

export default Sticky
