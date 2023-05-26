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
    backgroundColor: process.env.COLOR_BGCOLOR,
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
      'form/index',
      'navbar/index',
      'alert/index',
      'list/index',
      'footer-bar/index',
      'action-sheet/index',
      'count-down/index'
    ]
  })
}

export default defineAppConfig(config)
