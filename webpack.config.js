const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 9090,
    open: true,
    compress: true, // 启用gzip压缩
    hot: true, // 热更新
  },
  cache: {
    type: 'memory'
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx)$/,
        use: 'babel-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({})
  ]
}