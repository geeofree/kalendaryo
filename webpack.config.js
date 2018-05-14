const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
}
