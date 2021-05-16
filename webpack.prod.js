const { merge } = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = async (env, argv) => {
  return merge(common(env, argv), {
    mode: 'production',
  })
}
