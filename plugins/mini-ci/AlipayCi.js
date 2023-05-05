const readline = require('readline')
const utils = require('../utils')

const defaultDesc = '🎉版本上新啦'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

/**
 * @param ctx {import('@tarojs/service').IPluginContext}
 * @param env {Record<string, string>}
*/
module.exports = (ctx, env) => {
  return new Promise((resolve, reject) => {
    try {
      const options = {}
      const version = Reflect.get(env, utils.getEnvByName('VERSION'))
      const appid = Reflect.get(env, utils.getEnvByName('APP_ID'))
      const toolId = Reflect.get(env, utils.getEnvByName('TOOL_ID'))
      const privateKey = Reflect.get(env, utils.getEnvByName('PRIVATE_KEY'))

      if (utils.isValidEnvValue(version)) {
        Reflect.set(options, 'version', JSON.parse(version))
      }

      if (utils.isValidEnvValue(appid)) {
        Reflect.set(options, 'appid', JSON.parse(appid))
      }

      if (utils.isValidEnvValue(toolId)) {
        Reflect.set(options, 'toolId', JSON.parse(toolId))
      }

      if (utils.isValidEnvValue(privateKey)) {
        Reflect.set(options, 'privateKey', privateKey)
      }

      rl.question('😎 支付宝小程序备注：', (answer = defaultDesc) => {
        Reflect.set(options, 'desc', answer)
        resolve(options)
        rl.close()
      })
    } catch (e) {
      reject(e)
    }
  })
}
