const shell = require('shelljs')
const utils = require('../utils')
const { json2ts } = require('json-ts')

const output = utils.resolve('dist/types')

const toDTS = (...args) => {
  if (shell.test('-e', output)) {
    shell.rm('-r', output)
  }

  const env = args.reduce(
    (env, obj) => {
      for (const key in obj) {
        env[key.replace(/^process\.env\./, '')] = obj[key]
      }
      return env
    }, {}
  )

  shell.mkdir('-p', output)

  shell.ShellString(
    `declare global {
      namespace NodeJS {
        ${json2ts(JSON.stringify(env), {
          prefix: '',
          rootName: 'ProcessEnv'
        })}
      }
    }
    export {}`
  ).to(
    utils.resolve(output, 'env.d.ts')
  )
}

module.exports = {
  toDTS
}
