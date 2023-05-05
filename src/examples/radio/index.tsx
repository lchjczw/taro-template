import { App } from '@/components/app'
import { CellGroup, Cell } from '@/components/cell'
import { Space } from '@/components/space'
import { Radio } from '@/components/radio'

import Bem from '@txjs/bem'
import { defineComponent, reactive } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name, bem] = Bem('radio', less)

export default defineComponent({
  name,

  setup() {
    const radio = reactive({
      a1: 1,
      a2: 1,
      a3: 2,
      a4: 1,
      a5: 1,
      a6: 1,
      a7: 1
    })

    return () => (
      <App loading={false}>
        <App.Body>
          <view class={bem('container')}>
            <CellGroup inset title="基础用法">
              <Radio.Group v-model:value={radio.a1}>
                <Space direction="vertical">
                  <Radio name={1}>复选框1</Radio>
                  <Radio name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </CellGroup>
            <CellGroup inset title="水平布局">
              <Radio.Group v-model:value={radio.a2} direction="horizontal">
                <Radio name={1}>复选框1</Radio>
                <Radio name={2}>复选框2</Radio>
              </Radio.Group>
            </CellGroup>
            <CellGroup inset title="禁用状态">
              <Radio.Group disabled v-model:value={radio.a3}>
                <Space direction="vertical">
                  <Radio name={1}>复选框1</Radio>
                  <Radio name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </CellGroup>
            <CellGroup inset title="自定义形状">
              <Radio.Group v-model:value={radio.a3}>
                <Space direction="vertical">
                  <Radio shape="square" name={1}>复选框1</Radio>
                  <Radio shape="square" name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </CellGroup>
            <CellGroup inset title="自定义颜色">
              <Radio.Group v-model:value={radio.a4}>
                <Space direction="vertical">
                  <Radio checkedColor="var(--color-danger)" name={1}>复选框1</Radio>
                  <Radio checkedColor="var(--color-danger)" name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </CellGroup>
            <CellGroup inset title="左侧文本">
              <Radio.Group v-model:value={radio.a5}>
                <Space direction="vertical">
                  <Radio labelPosition="left" name={1}>复选框1</Radio>
                  <Radio labelPosition="left" name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </CellGroup>
            <CellGroup inset title="禁用文本点击">
              <Radio.Group v-model:value={radio.a6}>
                <Space direction="vertical">
                  <Radio labelDisabled name={1}>复选框1</Radio>
                  <Radio labelDisabled name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </CellGroup>
          </view>
          <Radio.Group v-model:value={radio.a7}>
            <CellGroup inset title="搭配单元格组件使用">
              <Cell
                clickable
                title="复选框a"
                onTap={() => radio.a7 = 1}
                v-slots={{
                  'right-icon': () => (
                    <Radio
                      name={1}
                      onTap={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    />
                  )
                }}
              />
              <Cell
                clickable
                title="复选框b"
                onTap={() => radio.a7 = 2}
                v-slots={{
                  'right-icon': () => (
                    <Radio
                      name={2}
                      onTap={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    />
                  )
                }}

              />
            </CellGroup>
          </Radio.Group>
        </App.Body>
      </App>
    )
  }
})
