const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './client/main.js',
    devtool: '#cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: '[name].bundle.js',
        publicPath: '/'
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }]
        }, {
            test: /\.(js|jsx)$/,
            use: 'babel-loader'
        }, {
            test: /\.html$/,
            use: 'html-loader'
        // }, {
        //     test: /\.json$/,
        //     use: 'raw-loader'
        }]
    },
    target: 'web',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['static/']),
        new HtmlWebpackPlugin({
            title: 'Address Book',
            template: './client/index.html'
        })
    ]
};