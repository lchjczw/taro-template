import { App } from '@/components/app'
import { Keyboard } from '@/components/keyboard'

import Bem from '@txjs/bem'
import { defineComponent, ref } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name, bem] = Bem('keyboard', less)

export default defineComponent({
  name,

  setup() {
    const show = ref(false)
    const value = ref('')

    return () => (
      <App loading={false}>
        <App.Body>
          <Keyboard
            v-models={[
              [show.value, 'show'],
              [value.value, 'value']
            ]}
          />
        </App.Body>
      </App>
    )
  }
})
