const shell = require('shelljs')
const minimist = require('minimist')
const bool = require('@txjs/bool')
const utils = require('../utils')

const getProfileName = (taroName) => {
  switch (taroName) {
    case 'tt':
    case 'weapp':
      return 'project.config.json'
    case 'alipay':
      return 'mini.project.json'
  }
}

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx, options = {}) => {
  const ciArgs = minimist(process.argv.slice(2), {
    string: 'mode',
    string: 'type'
  })

  if (bool.isNil(ciArgs.type)) {
    return
  }

  const profileName = getProfileName(ciArgs.type)

  // 目标小程序环境配置不存在
  if (bool.isNil(profileName)) {
    return
  }

  const outputPath = utils.resolve(ctx.paths.outputPath, profileName)

  ctx.onBuildFinish(() => {
    const configPath = utils.resolve('public', ciArgs.type, 'config.json')

    // 检查目标小程序环境
    if (!shell.test('-e', configPath)) {
      return
    }

    const config = {}
    const temp = shell.cat(configPath)

    // 检查配置文件
    if (utils.isJSON(temp)) {
      const tempConfig = JSON.parse(temp)

      if (bool.isPlainObject(tempConfig)) {
        Object.assign(config, tempConfig)
      }
    }

    const env = utils.getEnvResolve(ciArgs.mode, ciArgs.type)
    const appid = Reflect.get(env, utils.getEnvByName('APP_ID'))

    if (utils.isValidEnvValue(appid)) {
      Reflect.set(config, 'appid', JSON.parse(appid))
    }

    if (Reflect.has(options, ciArgs.type)) {
      Object.assign(config, Reflect.get(options, ciArgs.type))
    }

    // 缓存配置
    if (shell.test('-e', outputPath)) {
      const tempCache = shell.cat(outputPath)

      // 检查缓存配置
      if (utils.isJSON(tempCache)) {
        const tempConfig = JSON.parse(tempCache)

        if (bool.isPlainObject(tempConfig)) {
          Object.assign(config, tempConfig)
        }
      }
    }

    shell.ShellString(
      JSON.stringify(config, null, 2)
    ).to(
      outputPath
    )
  })
}
