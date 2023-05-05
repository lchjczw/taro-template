import { withInstall } from '../utils'
import _Space from './Space'

import './index.less'

export const Space = withInstall<typeof _Space>(_Space)

export { spaceProps } from './Space'
export type { SpaceAlign, SpaceDirection, SpaceProps, SpaceSize } from './Space'

export default Space
