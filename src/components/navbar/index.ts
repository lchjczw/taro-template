import { withInstall } from '../utils'
import _Navbar from './Navbar'

import './index.less'

export const Navbar = withInstall<typeof _Navbar>(_Navbar)

export default Navbar
