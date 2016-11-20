var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var options = {
    entry: {
        'app': './js/main.js',
        'styles': './scss/main.scss'
    },
    output: {
        path: path.dirname(__dirname) + '/assets/static/gen',
        filename: '[name].js',
        publicPath: '/static/gen/',
    },
    devtool: '#cheap-module-source-map',
    resolve: {
        extensions: ['', '.js'],
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/, 
            loader: 'url?limit=10000&name=images/[name].[ext]'
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
        },
        {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file-loader'
        }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css', {
            allChunks: true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = options;
