const path = require('path')
const pkg = require('../package.json')

const resolve = (...dir) => path.resolve(__dirname, '..', ...dir)

const config = {
  projectName: pkg.name,
  date: '2022-12-13',
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  framework: 'vue3',
  compiler: 'webpack5',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  cache: {
    enable: true
  },
  alias: {
    '@': resolve('src')
  },
  mini: {
    webpackChain: (chain) => {
      const rule = [
        {
          test: /\.mjs$/,
          include: [/pinia/],
          loader: 'babel-loader'
        }
      ]

      if (process.env.NODE_ENV === 'production') {
        rule.push({
          test: /\.js$/,
          loader: 'babel-loader'
        })
      }

      chain.merge({
        module: {
          rule
        }
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: true,
        config: {
          auto: true,
          namingPattern: 'module',
          generateScopedName: process.env.NODE_ENV === 'development'
            ? '[local]_[hash:base64:8]'
            : '[hash:base64:6]'
        }
      }
    },
    lessLoaderOption: {
      lessOptions: {
        javascriptEnabled: true
      }
    }
  },
  plugins: [
    [resolve('plugins/mini-ci')],
    [resolve('plugins/mini-compile')],
    [resolve('plugins/mini-config')],
    [resolve('plugins/mini-copy')],
    [resolve('plugins/mini-prompt')],
    [resolve('plugins/pollen')],
    [resolve('plugins/env')],
    ['@tarojs/plugin-framework-vue3', {
      vueLoaderOption: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('custom')
        }
      }
    }],
    ['taro-plugin-style-resource', {
      less: {
        patterns: [
          resolve('src/styles/ellipsis.less'),
          resolve('src/styles/hairline.less'),
          resolve('src/styles/mask-image.less')
        ]
      }
    }]
  ]
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
