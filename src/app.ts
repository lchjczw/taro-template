import '../dist/pollen/vars.css'
import '@/components/styles/index.less'
import '@/styles/normalize.less'
import '@/styles/ellipsis.less'
import '@/styles/hairline.less'

import Bem from '@txjs/bem'
import Taro, { getUpdateManager, exitMiniProgram } from '@tarojs/taro'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useEvents } from '@/hooks'
import { router } from '@/router'
import { useUserStore } from '@/stores'
import { modal, canIUseGetUpdateManager } from '@/utils'

// 开发环境提醒
if (process.env.NODE_ENV !== 'production') {
  runPrompt()
}

// 配置BEM
Bem.updateConfig({
  debugger: process.env.ENV !== 'production',
  prefixer: {
    comp: process.env.PREFIX,
    page: 'page'
  }
})

// @ts-ignore
Taro.options.html.transformText = (taroText: TaroText) => {
  if (taroText.nodeValue.indexOf('&nbsp;') !== -1) {
    const text = document.createElement('text')
    text.setAttribute('decode', 'true')
    text.appendChild(taroText)
    return text
  }
  return taroText
}

// @ts-ignore
Taro.options.html.transformElement = (taroElement: any) => {
  const h5ComponentTag = taroElement.ownerDocument.body.getElementsByClassName('__h5-component-tag')[0]

  if (h5ComponentTag) {
    useEvents.trigger('h5-transform-element', taroElement, h5ComponentTag)
  }

  return taroElement
}

const App = createApp({
  onShow(options: Taro.getLaunchOptionsSync.LaunchOptions) {
    if (canIUseGetUpdateManager()) {
      const updateManager = getUpdateManager()

      updateManager.onCheckForUpdate((res) => {
        if (!res.hasUpdate) {
          return
        }

        updateManager.onUpdateReady(() => {
          modal.info({
            title: '更新提示',
            content: '新版本已经准备好，现在更新并重启小程序~',
            onOk: () => updateManager.applyUpdate()
          })
        })

        updateManager.onUpdateFailed(() => {
          modal.info({
            title: '更新失败',
            content: '小程序更新失败，请删除当前小程序，重新搜索打开哟~',
            onOk: () => exitMiniProgram()
          })
        })
      })
    }

    const code = router.getRoutePermission(options.path)

    // TODO: 打开小程序页面拦截
    if (code !== 200) {
      console.log(options)
    }
  }
})

// pinia
App.use(createPinia())

// 获取本地登录用户缓存
useUserStore().updateAll()

export default App
