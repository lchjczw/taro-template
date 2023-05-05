import { withInstall } from '../utils'
import _H5 from './H5'

import './index.less'

export const H5 = withInstall<typeof _H5>(_H5)

export type { H5Instace } from './H5'

export default H5
