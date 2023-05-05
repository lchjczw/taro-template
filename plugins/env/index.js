const minimist = require('minimist')
const bool = require('@txjs/bool')
const utils = require('../utils')
const { toDTS } = require('./toDTS')

const getLessVars = (vars) => Object.keys(vars)
  .reduce(
    (ret, key) => {
      const name = key.replace(/^process\.env\./, '')
        .replace(/_/g, '-')
        .toLocaleLowerCase()
      ret[`@${name}`] = JSON.parse(vars[key])
      return ret
    }, {}
  )

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  const ciArgs = minimist(process.argv.slice(2), {
    string: 'mode',
    string: 'type'
  })

  if (bool.isNil(ciArgs.type)) {
    return
  }

  const env = utils.getEnvResolve(ciArgs.mode, ciArgs.type)
  const less = utils.getEnvResolve(ciArgs.mode, ciArgs.type, true)

  toDTS(env, less)

  ctx.modifyWebpackChain(({ chain }) => {
    const prefix = Reflect.get(env, utils.getEnvByName('PREFIX'))
    const lessVars = getLessVars(less)

    if (utils.isValidEnvValue(prefix)) {
      Reflect.set(lessVars, '@prefix', JSON.parse(prefix))
    }

    chain.module
      .rule('less')
      .oneOf('2')
      .use('3')
      .tap((options) => {
        if (options == null) {
          options = {
            lessOptions: {}
          }
        }
        options.lessOptions.modifyVars = lessVars
        return options
      })
      .end()

    chain.plugin('definePlugin')
      .tap((args) => {
        Object.assign(args[0], env)
        Object.assign(args[0], less)
        return args
      })
      .end()
  })
}
