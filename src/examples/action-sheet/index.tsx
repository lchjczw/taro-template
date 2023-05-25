import { App } from '@/components/app'
import { CellGroup, Cell } from '@/components/cell'
import { ActionSheet } from '@/components/action-sheet'

import Bem from '@txjs/bem'
import { defineComponent, reactive } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name, bem] = Bem('action-sheet', less)

export default defineComponent({
  name,

  setup() {
    const model = reactive({
      show1: false,
      show2: false
    })

    return () => (
      <App loading={false}>
        <App.Body>
          <CellGroup>
            <Cell
              isLink
              title="默认使用"
              onTap={() => model.show1 = true}
            />
            <Cell
              isLink
              title="自定义"
              onTap={() => model.show2 = true}
            />
          </CellGroup>
        </App.Body>
        <ActionSheet
          v-model:show={model.show1}
          description="请选择原因"
          cancelText="取消"
          actions={[
            { title: '选项1', color: 'red' },
            { title: '选项2' },
            { title: '选项3', disabled: true },
            { title: '选项4', loading: true },
            { title: '选项5', label: '这里是选项描述' },
            { title: '选项6' }
          ]}
        />
        <ActionSheet
          v-model:show={model.show2}
          closeable
          title="请选择原因"
        >
          <view style={{ padding: 'var(--padding-md) var(--padding-md) 200px' }}>内容</view>
        </ActionSheet>
      </App>
    )
  }
})
