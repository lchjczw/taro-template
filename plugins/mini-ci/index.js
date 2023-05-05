const minimist = require('minimist')
const bool = require('@txjs/bool')
const WeappCI = require('@tarojs/plugin-mini-ci/dist/WeappCI')
const AlipayCI = require('@tarojs/plugin-mini-ci/dist/AlipayCI')
const utils = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx, options = {}) => {
  const ciArgs = minimist(process.argv.slice(2), {
    string: 'mode',
    string: 'type',
    string: 'action'
  })

  if (bool.isNil(ciArgs.type)) {
    return
  }

  const command = ciArgs._[0]
  const env = utils.getEnvResolve(ciArgs.mode, ciArgs.type)

  if (!Reflect.has(options, ciArgs.type)) {
    Reflect.set(options, ciArgs.type, {})
  }

  const doAction = async (action) => {
    let ci = null

    switch (ciArgs.type) {
      case 'weapp': {
          const {
            version,
            desc,
            ...result
          } = await (require('./WeappCi')(ctx, env))
          Reflect.set(options, 'version', version)
          Reflect.set(options, 'desc', desc)
          Reflect.set(options, ciArgs.type,
            Object.assign(Reflect.get(options, ciArgs.type), result)
          )
          ci = new WeappCI.default(ctx, options)
        }
        break
      case 'alipay': {
          const {
            version,
            desc,
            ...result
          } = await (require('./AlipayCi')(ctx, env))
          Reflect.set(options, 'version', version)
          Reflect.set(options, 'desc', desc)
          Reflect.set(options, ciArgs.type,
            Object.assign(Reflect.get(options, ciArgs.type), result)
          )
          ci = new AlipayCI.default(ctx, options)
        }
        break
    }

    if (ci == null) {
      return
    }

    // 设置项目路径
    ci.setProjectPath(ctx.paths.outputPath)
    // 初始化上传
    ci.init()

    switch (action) {
      case 'open':
        await ci.open()
        break
      case 'upload':
        await ci.upload()
        break
    }
  }

  ctx.onBuildComplete(async () => {
    if (command === 'build' && ciArgs.action) {
      await doAction(ciArgs.action)
    }
  })
}
