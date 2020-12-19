
const path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
var htmlReplaceConfig = require('./conf/html-replace')

/* ---------------
 * Main config
 * We will place here all the common settings
 * ---------------*/
var config = {
  mode: 'development',
  entry: 
  {
      dist: './src/index.ts'
  },    
  devServer: {
    // host: '0.0.0.0'
    port: 9000
  },
  resolve: {
      extensions: ['.ts', '.js']
    },
  module: {
      rules: [
          {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.json'
              }
          }
      ],
  }
}

var configLocalDev = Object.assign({}, config, {
  output: {
      library: 'op',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      filename: 'lib/op.js',
      path: path.resolve(__dirname, 'temp'),
  },
  plugins: [
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'src/template.index.html',
          inject: false,
          minify: false,
          chunks: 'all',
          chunksSortMode: 'auto'
        }),
        new HtmlReplaceWebpackPlugin(htmlReplaceConfig)
  ]
});

module.exports = [configLocalDev]; 