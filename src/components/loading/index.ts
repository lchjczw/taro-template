import { withInstall } from '../utils'
import _Loading from './Loading'

import './index.less'

export const Loading = withInstall<typeof _Loading>(_Loading)

export default Loading
