const shell = require('shelljs')
const minimist = require('minimist')
const fse = require('fs-extra')
const bool = require('@txjs/bool')
const utils = require('../utils')

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx) => {
  const ciArgs = minimist(process.argv.slice(2), {
    string: 'type'
  })

  if (bool.isNil(ciArgs.type)) {
    return
  }

  const source = utils.resolve('public', ciArgs.type, 'assets')

  ctx.onBuildFinish(async () => {
    if (shell.test('-d', source)) {
      await fse.copy(source, ctx.paths.outputPath)
    }
  })
}
