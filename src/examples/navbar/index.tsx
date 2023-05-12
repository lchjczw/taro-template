import { App } from '@/components/app'
import { Navbar } from '@/components/navbar'

import Bem from '@txjs/bem'
import { defineComponent } from 'vue'

import less from './index.module.less'

const [name, bem] = Bem('navbar', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <Navbar
          fixed={false}
          position="center"
          title="标题"
        />
        <Navbar
          fixed={false}
          safeAreaInsetTop={false}
          position="left"
          title="标题"
        />
        <Navbar
          fixed={false}
          safeAreaInsetTop={false}
          position="left"
          title="标题"
          leftArrowNoPaddingLeft
        />
      </App>
    )
  }
})
