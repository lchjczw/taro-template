const config = {
  style: 'v2',
  pages: [
    'pages/home/index'
  ],
  subpackages: [],
  window: {
    navigationStyle: 'custom',
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#ffffff',
    backgroundColor: process.env.BACKGROUND_LIGHT_COLOR,
    navigationBarTitleText: process.env.PROJECT_NAME
  },
  useExtendedLib: {
    weui: true
  }
} as Taro.Config

config.subpackages!.push({
  root: 'subpackages',
  pages: [
    'login/index'
  ]
})

// 开发示例分包
if (process.env.NODE_ENV === 'development') {
  config.subpackages!.push({
    root: 'examples',
    pages: [
      'button/index',
      'cascader/index',
      'grid/index',
      'cell/index',
      'checkbox/index',
      'radio/index',
      'keyboard/index',
      'h5/index',
      'result/index',
      'form/index'
    ]
  })
}

// 测试环境分包
if (process.env.ENV === 'test') {
  config.subpackages!.push({
    root: 'tests',
    pages: []
  })
}

export default defineAppConfig(config)
