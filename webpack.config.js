let HtmlPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let rules = require('./webpack.config.rules')();
let path = require('path');
// let webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    module: { rules },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: {
        //         drop_debugger: false,
        //         warnings: false
        //     }
        // }),
        new HtmlPlugin({
            title: 'Friend Filter',
            template: 'views/index.hbs'
        }),
        new CleanWebpackPlugin(['dist'])
    ]
};