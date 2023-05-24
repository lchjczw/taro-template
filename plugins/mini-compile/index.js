const shell = require('shelljs')
const minimist = require('minimist')
const bool = require('@txjs/bool')
const utils = require('../utils')

const config = {
  enterPath: 'compile.config.json'
}

const formatCompileMode = (taroEnv, modes) => {
  switch (taroEnv) {
    case 'alipay':
      return { modes }
    case 'tt':
    case 'weapp':
      return {
        condition: {
          miniprogram: {
            list: modes
          }
        }
      }
  }
}

const buildCompileMode = (mode, taroEnv, outDir, options) => {
  const temp = shell.cat(utils.resolve(options.enterPath))
  const envConfig = options[taroEnv]

  if (temp == '' || !utils.isJSON(temp)) {
    return
  }

  const modes = JSON.parse(temp)

  if (!Array.isArray(modes)) {
    return
  }

  let titleKey,
    pageKey,
    queryKey,
    launchModeKey,
    sceneKey,
    output

  switch (taroEnv) {
    case 'alipay':
      titleKey = 'title'
      pageKey = 'page'
      queryKey = 'pageQuery'
      launchModeKey = 'launchMode'
      sceneKey = 'scene'
      output = '.mini-ide/compileMode.json'
      break
    case 'weapp':
      titleKey = 'name'
      pageKey = 'pathName'
      queryKey = 'query'
      launchModeKey = 'launchMode'
      sceneKey = 'scene'
      output = 'project.private.config.json'
      break
    case 'tt':
      titleKey = 'name'
      pageKey = 'pathName'
      queryKey = 'query'
      launchModeKey = 'launchFrom'
      sceneKey = 'scene'
      output = 'project.config.json'
      break
  }

  const compileModes = modes.reduce(
    (modes, {
      title,
      page,
      query,
      launchMode,
      scene,
      env,
      support
    }) => {
      if (bool.isNil(env)) {
        env = ['all']
      }

      if (bool.isNil(support)) {
        support = ['all']
      }

      if (
        // 运行环境支持
        (env.includes('all') || env.includes(mode)) &&
        // 小程序环境支持
        (support.includes('all') || support.includes(taroEnv))
      ) {
        modes.push({
          [titleKey]: title,
          [pageKey]: page,
          [queryKey]: query,
          [launchModeKey]: launchMode,
          [sceneKey]: scene
        })
      }
      return modes
    }, []
  )

  // 检查是否包含文件夹
  if (/\//g.test(output)) {
    const outputDir = utils.resolve(outDir, output.replace(/\/.+\.json$/, ''))

    // 检查文件夹是否存在
    if (!shell.test('-d', outputDir)) {
      shell.mkdir('-p', outputDir)
    }
  }

  const outputPath = utils.resolve(outDir, output)
  const config = formatCompileMode(taroEnv, compileModes)

  if (bool.isPlainObject(envConfig)) {
    Object.assign(config, envConfig)
  }

  shell.ShellString(
    JSON.stringify(config, null, 2)
  ).to(
    outputPath
  )
}

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 */
module.exports = (ctx, options = {}) => {
  const ciArgs = minimist(process.argv.slice(2), {
    string: 'mode',
    string: 'type'
  })

  if (bool.isNil(ciArgs)) {
    return
  }

  options = Object.assign({}, config, options)

  ctx.onBuildFinish(() => {
    if (shell.test('-e', utils.resolve(options.enterPath)) && ciArgs.type !== 'h5') {
      buildCompileMode(
        ciArgs.mode || process.env.NODE_ENV,
        ciArgs.type,
        ctx.paths.outputPath,
        options
      )
    }
  })
}
