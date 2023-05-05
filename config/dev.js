const minimist = require('minimist')

const plugins = []
const ciArgs = minimist(process.argv.slice(2), {
  boolean: 'debug'
})

if (ciArgs.debug) {
  plugins.push('@tarojs/plugin-vue-devtools')
}

module.exports = {
  plugins,
  env: {
    NODE_ENV: '"development"'
  }
}
