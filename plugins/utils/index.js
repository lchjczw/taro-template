const path = require('path')
const dotenv = require('dotenv')
const bool = require('@txjs/bool')

const resolve = (...dir) => path.resolve(__dirname, '../../', ...dir)

/**
 * 获取环境配置文件
 * @param {string} mode
 * @param {string} type
 * @param {boolean} isTheme
 * @returns {Record<string, string>}
 */
const getEnvResolve = (mode, type, isTheme = false) => {
  mode = mode || process.env.NODE_ENV

  const env = {}
  const directory = isTheme ? '.env.less' : '.env'
  const globalConfig = dotenv.config({ path: resolve(directory) })
  const envConfig = dotenv.config({ path: resolve(`${directory}.${mode}`) })
  const taroConfig = dotenv.config({ path: resolve(`public/${type}/${directory}`) })
  const taroEnvConfig = dotenv.config({ path: resolve(`public/${type}/${directory}.${mode}`) })

  if (!globalConfig.error) {
    Object.assign(env, globalConfig.parsed)
  }

  if (!envConfig.error) {
    Object.assign(env, envConfig.parsed)
  }

  if (!taroConfig.error) {
    Object.assign(env, taroConfig.parsed)
  }

  if (!taroEnvConfig.error) {
    Object.assign(env, taroEnvConfig.parsed)
  }

  const vars = Object
    .keys(env)
    .reduce(
      (ret, key) => {
        let value = env[key]

        if (/^\$/.test(value)) {
          value = value.replace(/^\$/, '')
          if (value in env) {
            value = env[value]
          }
        }

        ret[`process.env.${key}`] = JSON.stringify(value)
        return ret
      }, {}
    )

  return vars
}

/**
 * 环境名称
 * @param {string} value
 * @returns {string}
 */
const getEnvByName = (value) => {
  if (bool.isNil(value)) {
    return ''
  }
  return `process.env.${value}`
}

/**
 * 是有效的环境值
 * @param {string} value
 * @returns {boolean}
 */
const isValidEnvValue = (value) => {
  return value != null && value != '""'
}

/**
 * 检查JSON格式类型
 * @param {string} value
 * @returns {boolean}
 */
const isJSON = (value) => {
  if (bool.isNil(value)) {
    return false
  }

  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  resolve,
  getEnvResolve,
  getEnvByName,
  isJSON,
  isValidEnvValue
}
