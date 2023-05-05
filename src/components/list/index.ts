import type { ComponentPublicInstance } from 'vue'

import { withInstall } from '../utils'
import _List, { ListProps, ListProvide } from './List'

import './index.less'

export const List = withInstall<typeof _List>(_List)

export type ListInstance = ComponentPublicInstance<ListProps, ListProvide>

export default List
