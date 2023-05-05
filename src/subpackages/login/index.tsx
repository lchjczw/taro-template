import { App } from '@/components/app'
import { Navbar } from '@/components/navbar'
import { Sticky } from '@/components/sticky'

import Bem from '@txjs/bem'
import { useRouter } from '@tarojs/taro'
import { defineComponent } from 'vue'

import less from './index.module.less'

const [name] = Bem('login', less)

export default defineComponent({
  name,

  setup() {
    const { params } = useRouter()

    console.log(params)

    return () => (
      <App loading={false}>
        <Navbar />
        <App.Body>
          <Sticky>内容</Sticky>
        </App.Body>
      </App>
    )
  }
})
