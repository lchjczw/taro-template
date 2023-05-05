import { App } from '@/components/app'
import { CellGroup, Cell } from '@/components/cell'
import { Cascader } from '@/components/cascader'

import Bem from '@txjs/bem'
import { defineComponent, ref } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name] = Bem('cascader', less)

export default defineComponent({
  name,

  setup() {
    const visible = ref(false)
    const value = ref()

    return () => (
      <App loading={false}>
        <App.Body>
          <CellGroup
            inset
            title="常规使用"
          >
            <Cell
              clickable
              title="选择地区"
              value={value.value}
              onTap={() => {
                visible.value = true
              }}
            />
          </CellGroup>
          <Cascader
            v-model:show={visible.value}
            v-model:value={value.value}
            title="选择地区"
            options={[
              {
                text: '北京',
                value: '10101000000',
                children: [
                  {
                    text: 'xxx1',
                    value: '10111000000'
                  }
                ]
              },
              {
                text: '天津',
                value: '20202000000'
              }
            ]}
          />
        </App.Body>
      </App>
    )
  }
})
