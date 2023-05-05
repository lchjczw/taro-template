import { App } from '@/components/app'
import { CellGroup, Cell } from '@/components/cell'
import { Space } from '@/components/space'
import { Checkbox, type CheckboxGroupInstance, type CheckboxInstance } from '@/components/checkbox'
import { Button } from '@/components/button'

import Bem from '@txjs/bem'
import { defineComponent, ref, reactive } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name, bem] = Bem('checkbox', less)

export default defineComponent({
  name,

  setup() {
    const checkboxGroupRef = ref<CheckboxGroupInstance>()
    const checkboxRefs = ref<CheckboxInstance[]>([])
    const checkbox = reactive({
      a1: true,
      a2: true,
      a3: true,
      a4: true,
      a5: true,
      a6: true,
      a7: true,
      a8: true,
      a9: [],
      a10: [],
      a11: [],
      a12: []
    })

    const checkAll = () => {
      checkboxGroupRef.value?.toggleAll(true)
    }

    const toggleAll = () => {
      checkboxGroupRef.value?.toggleAll()
    }

    const toggle = (index: number) => {
      checkboxRefs.value[index].toggle()
    }

    return () => (
      <App loading={false}>
        <App.Body>
          <view class={bem('container')}>
            <CellGroup inset title="基础用法">
              <Checkbox v-model:value={checkbox.a1}>复选框</Checkbox>
            </CellGroup>
            <CellGroup inset title="禁用状态">
              <Space direction="vertical">
                <Checkbox disabled>复选框</Checkbox>
                <Checkbox disabled v-model:value={checkbox.a2}>复选框</Checkbox>
              </Space>
            </CellGroup>
            <CellGroup inset title="自定义形状">
              <Checkbox shape="square" v-model:value={checkbox.a3}>自定义形状</Checkbox>
            </CellGroup>
            <CellGroup inset title="自定义颜色">
              <Checkbox checkedColor="var(--color-danger)" v-model:value={checkbox.a4}>自定义颜色</Checkbox>
            </CellGroup>
            <CellGroup inset title="左侧文本">
              <Checkbox labelPosition="left" v-model:value={checkbox.a5}>左侧文本</Checkbox>
            </CellGroup>
            <CellGroup inset title="禁用文本点击">
              <Checkbox labelDisabled v-model:value={checkbox.a6}>复选框</Checkbox>
            </CellGroup>
            <CellGroup inset title="基础用法">
              <Space direction="vertical">
                <Checkbox v-model:value={checkbox.a7}>复选框a</Checkbox>
                <Checkbox v-model:value={checkbox.a8}>复选框b</Checkbox>
              </Space>
            </CellGroup>
            <CellGroup inset title="水平排版">
              <Checkbox.Group v-model:value={checkbox.a9} direction="horizontal">
                <Checkbox name="a">复选框a</Checkbox>
                <Checkbox name="b">复选框b</Checkbox>
              </Checkbox.Group>
            </CellGroup>
            <CellGroup inset title="限制最大可选数">
              <Checkbox.Group v-model:value={checkbox.a10} max={2}>
                <Space direction="vertical">
                  <Checkbox name="a">复选框a</Checkbox>
                  <Checkbox name="b">复选框b</Checkbox>
                  <Checkbox name="c">复选框c</Checkbox>
                </Space>
              </Checkbox.Group>
            </CellGroup>
            <CellGroup inset title="全选或反选">
              <Checkbox.Group v-model:value={checkbox.a11} ref={checkboxGroupRef}>
                <Space direction="vertical">
                  <Checkbox name="a">复选框a</Checkbox>
                  <Checkbox name="b">复选框b</Checkbox>
                  <Checkbox name="c">复选框c</Checkbox>
                </Space>
              </Checkbox.Group>
              <Space style={{ marginTop: '12px' }}>
                <Button type="primary" onTap={checkAll}>全选</Button>
                <Button type="primary" onTap={toggleAll}>反选</Button>
              </Space>
            </CellGroup>
          </view>
          <Checkbox.Group v-model:value={checkbox.a12}>
            <CellGroup inset title="搭配单元格组件使用">
              <Cell
                clickable
                title="复选框a"
                onTap={() => toggle(0)}
                v-slots={{
                  'right-icon': () => (
                    <Checkbox
                      name="a"
                      ref={(el: CheckboxInstance) => checkboxRefs.value.push(el)}
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
                onTap={() => toggle(1)}
                v-slots={{
                  'right-icon': () => (
                    <Checkbox
                      name="b"
                      ref={(el: CheckboxInstance) => checkboxRefs.value.push(el)}
                      onTap={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    />
                  )
                }}

              />
            </CellGroup>
          </Checkbox.Group>
        </App.Body>
      </App>
    )
  }
})
