const path = require('path')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  ctx.modifyWebpackChain(({ chain }) => {
    chain
      .plugin('providerPlugin')
      .tap((args) => {
        args[0].runPrompt = [path.resolve(__dirname, './runPrompt.js'), 'default']
        return args
      })
  })
}
