import { withInstall } from '../utils'
import _Result, { resultSharedProps } from './Result'

import './index.less'

const Result = withInstall<typeof _Result>(_Result)

export * from './types'
export { Result, resultSharedProps }
export default Result
