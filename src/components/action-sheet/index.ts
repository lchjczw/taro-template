import { withInstall } from '../utils'
import _ActionSheet from './ActionSheet'

import './index.less'

export const ActionSheet = withInstall<typeof _ActionSheet>(_ActionSheet)

export { actionSheetProps } from './ActionSheet'
export type { ActionSheetProps, ActionSheetOption } from './ActionSheet'

export default ActionSheet
