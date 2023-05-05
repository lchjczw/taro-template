import { App } from '@/components/app'
import { CellGroup } from '@/components/cell'
import { Space } from '@/components/space'
import { Button } from '@/components/button'

import Bem from '@txjs/bem'
import { defineComponent } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name] = Bem('button', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body>
          <CellGroup inset title="按钮类型">
            <Space wrap>
              <Button type="default">默认按钮</Button>
              <Button type="primary">主要按钮</Button>
              <Button type="success">成功按钮</Button>
              <Button type="danger">危险按钮</Button>
              <Button type="warning">警告按钮</Button>
            </Space>
          </CellGroup>
          <CellGroup inset title="朴素按钮">
            <Space wrap>
              <Button plain type="danger">朴素按钮</Button>
              <Button plain type="primary">朴素按钮</Button>
            </Space>
          </CellGroup>
          <CellGroup inset title="禁用状态">
            <Space wrap>
              <Button disabled type="danger">禁用按钮</Button>
              <Button disabled type="primary">禁用按钮</Button>
            </Space>
          </CellGroup>
          <CellGroup inset title="加载状态">
            <Space wrap>
              <Button loading type="danger">加载按钮</Button>
              <Button loading loadingText="加载中" type="primary">加载按钮</Button>
            </Space>
          </CellGroup>
          <CellGroup inset title="按钮形状">
            <Space wrap>
              <Button type="default">方形按钮</Button>
              <Button round type="primary">半圆按钮</Button>
            </Space>
          </CellGroup>
          <CellGroup inset title="图标按钮">
            <Space wrap>
              <Button icon="delete" type="danger"></Button>
              <Button icon="wechat" type="primary">微信</Button>
            </Space>
          </CellGroup>
          <CellGroup inset title="按钮尺寸">
            <Space fill wrap direction="vertical">
              <Button block size="large" type="primary">大按钮</Button>
              <Button block type="primary">常规按钮</Button>
              <Button block size="small" type="primary">小按钮</Button>
              <Button block size="mini" type="primary">最小按钮</Button>
            </Space>
            <Space wrap>
              <Button size="large" type="primary">大按钮</Button>
              <Button type="primary">常规按钮</Button>
              <Button size="small" type="primary">小按钮</Button>
              <Button size="mini" type="primary">最小按钮</Button>
            </Space>
          </CellGroup>
          <CellGroup inset title="路由跳转">
            <Space wrap>
              <Button url="home" linkType="reLaunch" type="primary">访问home</Button>
            </Space>
          </CellGroup>
        </App.Body>
      </App>
    )
  }
})
