const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        app: './assets/js/main.js',
        styles: './assets/scss/main.scss'
    },
    output: {
        path: path.resolve(__dirname, 'static/dist'),
    },
    resolve: {
        modules: [process.env.NODE_PATH, 'node_modules'],
    },
    resolveLoader: {
        modules: [process.env.NODE_PATH, 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader, // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader', // compiles Sass to CSS
                    options: {
                        implementation: require("sass")
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};
