
const path = require('path');

/* ---------------
 * Main config
 * We will place here all the common settings
 * ---------------*/
var config = {
  mode: 'development',
  entry: 
  {
      bundle: ['./src/index.ts']
  },    
  devServer: {
    // host: '0.0.0.0'
    contentBase: 'public',
    port: 9000
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte')
    },
      extensions: ['.mjs', '.ts', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main']      
    },
  module: {
      rules: [
          {
            test: /\.svelte$/,
            exclude: /node_modules/,
            use: 'svelte-loader-hot'
          },
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
      path: __dirname + '/public',
      filename: '[name].js',
      chunkFilename: '[name].[id].js'
  }
});

module.exports = [configLocalDev]; 