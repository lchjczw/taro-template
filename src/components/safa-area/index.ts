import { withInstall } from '../utils'
import _SafeArea from './SafeArea'

import './index.less'

export const SafeArea = withInstall<typeof _SafeArea>(_SafeArea)

export default SafeArea
