import { withInstall } from '../utils'
import _Cascader from './Cascader'

import './index.less'

export const Cascader = withInstall<typeof _Cascader>(_Cascader)

export * from './types'

export default Cascader
