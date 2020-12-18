const path = require('path');

// var HtmlWebpackPlugin = require('html-webpack-plugin')
// var HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
// var htmlReplaceConfig = require('./conf/html-replace')


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

var configDist = Object.assign({}, config, {
    output: {
        library: 'op',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename: 'op.js',
        path: path.resolve(__dirname, 'dist'),
    }
});


// var configGithubPages = Object.assign({}, config, {
//     output: {
//         library: 'game3js',
//         libraryTarget: 'umd',
//         umdNamedDefine: true,
//         filename: 'lib/game3.js',
//         path: path.resolve(__dirname, 'docs'),
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             filename: 'index.html',
//             template: 'src/template.index.html',
//             inject: false,
//             minify: false,
//             chunks: 'all',
//             chunksSortMode: 'auto'
//           }),
//           new HtmlWebpackPlugin({
//             filename: 'game3js.webmanifest',
//             template: 'src/template.webmanifest',
//             inject: false,
//             minify: false,
//             chunks: 'all',
//             chunksSortMode: 'auto'
//           }),
//           new HtmlReplaceWebpackPlugin(htmlReplaceConfig)
//     ]
// });


module.exports = [configDist]; // , configGithubPages];