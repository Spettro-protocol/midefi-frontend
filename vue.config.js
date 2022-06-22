const { gitDescribeSync } = require('git-describe')
const { version } = require('./package.json')

process.env.VUE_APP_GIT_HASH = gitDescribeSync({
  customArguments: ['--abbrev=40'], // full 40-character SHA-1 commit hash
}).hash

module.exports = {
  transpileDependencies: ['vuetify', 'VueGoogleCharts'],
  lintOnSave: false,
  configureWebpack: {
    output: {
      filename: `[name]-${version}.[hash].bundle.js`,
    },
  },
}
