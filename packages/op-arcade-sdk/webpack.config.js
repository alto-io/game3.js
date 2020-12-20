const path = require('path');

/* ---------------
 * Main config
 * We will place here all the common settings
 * ---------------*/
var config = {
    mode: 'production',
    entry: 
    {
        dist: './src/index.ts'
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
            use: [
                {
                loader: 'svelte-loader-hot',
                options: {
                    customElement: true
                    }
                }
            ]
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



var configDist = Object.assign({}, config, {
    output: {
        library: 'op',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename: 'op.js',
        path: path.resolve(__dirname, 'dist'),
    }
});


var configLocalDev = Object.assign({}, config, {
    output: {
        library: 'op',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename: 'lib/op.js',
        path: path.resolve(__dirname, '../../docs'),
    }
});


module.exports = [configDist, configLocalDev]; 