import { withInstall } from '../utils'
import _Result from './Result'

import './index.less'

export const Result = withInstall(_Result)
export default Result

export * from './types'
export { resultSharedProps } from './Result'
