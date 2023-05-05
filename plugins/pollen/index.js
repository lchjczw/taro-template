const shell = require('shelljs')
const utils = require('../utils')

const configPath = utils.resolve('plugins/pollen/config.js')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  ctx.onBuildStart(() => {
    if (shell.test('-e', configPath)) {
      shell.exec(`pollen --config ${configPath}`)
    }
  })
}
