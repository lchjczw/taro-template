import { App } from '@/components/app'
import { Navbar } from '@/components/navbar'

import Bem from '@txjs/bem'
import { defineComponent } from 'vue'

import less from './index.module.less'

const [name] = Bem('login', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <Navbar />
        <App.Body>
        </App.Body>
      </App>
    )
  }
})
