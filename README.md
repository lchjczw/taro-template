# taro-template

> 目前仅在微信小程序、支付宝小程序、抖音小程序使用实践
>
> 抖音小程序部分不支持，请查阅tarojs官方文档

## 注意事项

##### 关于 `vue3` 自定义组件 `isCustomElement` 配置

.jsx/.tsx `@vue/babel-preset-jsx`

```ts
// babel.config.js
module.exports = {
  presets: {
    ['taro', {
      ...
      vueJsx: {
        isCustomElement: (tag) => tag.startsWith('custom')
      }
    }]
  }
}
```

.vue原生模板 `@tarojs/plugin-framework-vue3`

```ts
const config = {
  plugins: [
    ['@tarojs/plugin-framework-vue3', {
      vueLoaderOption: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('custom')
        }
      }
    }]
  ]
}
```

## 环境配置

> 所有环境配置都会被注入 `process.env`，可以开发全局使用
>
> 在打包的 `dist/types` 文件下自动生成 `env.d.ts` typescript声明文件

- .env 默认环境配置
- .env.[mode] 开发环境配置
- public 文件夹
  - [type]
    - .env 小程序环境配置
    - .env.[mode] 指定开发环境下小程序环境配置

运行命令

```ts
// 运行test环境
npm run dev:weapp -- --mode test
```

> 运行命令说明配置
>
> 在项目根目录添加指定环境文件，例如：`.env.test` 测试环境，在运行 `npm run dev:weapp -- --mode test` 命令时会自动覆盖默认环境配置

## `public` 目录结构

```js
public
├── weapp
│   ├── assets
│   │   └── ...
│   ├── config.json
│   ├── .env
│   └── .env.[mode]
├── tt
│   ├── assets
│   │   └── ...
│   ├── config.json
│   ├── .env
│   └── .env.[mode]
└── alipay
    ├── assets
    │   └── ...
    │   └── .mini-ide
    │       └── project-ide.json
    ├── config.json
    ├── .env
    └── .env.[mode]
``` 

## 插件支持

### `vue-devtools` 开发调试工具

> 只支持 `weapp` 小程序环境

运行命令

```ts
npm run dev:weapp -- --debug
```

---

### `mini-ci` 自动化上传小程序包插件

> 支持.env文件配置，字段必须转为下划线全大写
>
> 该插件使用 [@taro/plugin-mini-ci](https://github.com/NervJS/taro/tree/next/packages/taro-plugin-mini-ci) 上传打包文件

插件配置

```js
/**
 * @typedef { import("@tarojs/plugin-mini-ci").CIOptions } CIOptions
 * @type {CIOptions}
 */
const CIPluginOpt = {
  weapp: {
    appid: '微信小程序appid',
    privateKeyPath: '密钥文件相对项目根目录的相对路径，例如 key/private.appid.key',
  },
  tt: {
    email: '字节小程序邮箱',
    password: '字节小程序密码',
  },
  alipay: {
    appid: '支付宝小程序appid',
    toolId: '工具id',
    privateKeyPath: '密钥文件相对项目根目录的相对路径，例如 key/pkcs8-private-pem',
  },
  // 版本号
  version: '1.0.0',
  // 版本发布描述
  desc: '版本描述',
}
```

---

### `mini-compile` 小程序编译模式插件

> 微信小程序会生成本地私有小程序配置文件

- 微信小程序 `project.private.config.json`
- 支付宝小程序 `.mini-ide/compileMode.json`
- 抖音小程序 `project.config.json`

默认工程根目录 `compile.config.json` 同时也支持自定义文件路径，在项目 `config.js` 文件配置插件时传入文件路径

```js
{
  ...
  plugins: [
    [resolve('plugins/mini-compile'), {
      enterPath: '自定义配置路径'
    }]
  ]
}
```

插件配置

```ts
interface compileConfigItem {
  /** 标题 */
  title: string
  /** 页面URL */
  page: string
  /** 查询参数 */
  query: string
  /** 运行模式 */
  launchMode: string
  /** 携带参数 */
  scene: string | null
  /** 支持小程序环境 */
  support: ("all" | TARO_ENV)[]
  /** 支持运行环境 */
  env: ("all" | 运行环境)[]
}
```

---

### `mini-config` 小程序配置插件

在 `public` 指定小程序目录下，添加配置 `config.json` 文件，具体配置可以查看官方文档

- `project.config.json` [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)
- `mini.project.json` [支付宝小程序](https://opendocs.alipay.com/mini/03dbc3)
- `project.config.json` [抖音小程序](https://developer.open-douyin.com/docs/resource/zh-CN/interaction/develop/framework/basic-reference/catalog-structure/)

---

### `mini-copy` 拷贝文件到打包目录

该插件会在项目构建完成后，自动拷贝 `public` 指定小程序目录下 `assets` 文件夹拷贝到项目打包根目录，假如：打包目录在 `dist/weapp`，则至 `dist/weapp/..`

---

### `mockjs`

在项目根目录 `mock` 文件夹配置接口方法

运行命令

```ts
npm run dev:weapp -- --mock
```
