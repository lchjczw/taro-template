import { App } from '@/components/app'
import { Result } from '@/components/result'

import Bem from '@txjs/bem'
import { defineComponent } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name, bem] = Bem('result', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body>
          <Result status="500" />
          <Result status="404" />
          <Result status="error" />
          <Result status="network" />
          <Result status="nodata" />
        </App.Body>
      </App>
    )
  }
})
