var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var options = {
    entry: {
        app: './js/main.js',
        styles: './scss/main.scss'
    },
    output: {
        path: path.resolve(path.dirname(__dirname), 'assets/static/gen'),
        filename: '[name].js',
        publicPath: '/static/gen/',
    },
    devtool: '#cheap-module-source-map',
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js']
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/, 
            use: 'url?limit=10000&name=images/[name].[ext]'
        },
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({loader: 'css-loader!sass-loader', fallbackLoader: 'style-loader'})
        },
        {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            use: 'file-loader'
        }
        ]
    },
    plugins: [
        new ExtractTextPlugin({ filename: 'styles.css', allChunks: true }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = options;
