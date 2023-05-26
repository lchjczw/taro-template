import { withInstall } from '../utils'
import _ActionSheet from './ActionSheet'

import './index.less'

export const ActionSheet = withInstall(_ActionSheet)
export default ActionSheet

export { actionSheetProps } from './ActionSheet'
export type { ActionSheetProps, ActionSheetOption } from './ActionSheet'
