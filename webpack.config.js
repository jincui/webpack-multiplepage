var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var args = require('yargs').argv;

// parameters
var isProd = args.prod;
var isMock = args.mock;

var plugins = [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
        __PROD__: isProd,
        __MOCK__: isMock
    }),
    new webpack.optimize.CommonsChunkPlugin('common', isProd ? 'common/common.[hash].js' : 'common/common.js'),
    new ExtractTextPlugin(isProd ? '[name]/[name].[contenthash].css' : '[name]/[name].css'),
    new webpack.HotModuleReplacementPlugin()
];

plugins.push(
    new HtmlWebpackPlugin({
        template: './source/pages/index/index.jade',
        filename: 'index.html',
        chunks: ['common', 'index']
    }),
    new HtmlWebpackPlugin({
        template: './source/pages/help/help.jade',
        filename: 'help/index.html',
        chunks: ['common', 'help']
    }),
    new HtmlWebpackPlugin({
        template: './source/pages/about/about.jade',
        filename: 'about/index.html',
        chunks: ['common', 'about']
    })
);

var base = './';
var entryJs = {
    index: [base + '/source/pages/index/index.js'],
    help: [base + '/source/pages/help/help.js'],
    about: [base + '/source/pages/about/about.js']
};
entryJs['common'] = [
    // 3rd dependencies
    'normalize.css/normalize.css',
    'bootstrap/dist/js/bootstrap.min',
    'bootstrap/dist/css/bootstrap.min.css',
    'font-awesome/css/font-awesome.min.css'
];

if (isProd) {
    plugins.push(
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            mangle: false
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    );
}

module.exports = {
    entry: entryJs,
    output: {
        path: base + 'build',
        filename: isProd ? '[name]/[name].[hash].js' : '[name]/[name].js',
        chunkFilename: isProd ? '[name]/[name].[hash].chunk.js' : '[name]/[name].chunk.js'
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            loader: 'eslint',
            exclude: /node_modules/
        }],
        loaders: [{
            test: /\.html$/,
            loader: 'html'
        }, {
            test: /\.jade$/,
            loader: 'jade'
        }, {
            test: /\.styl$/,
            loader: ExtractTextPlugin.extract('vue-style', 'css?sourceMap!postcss!stylus', {
                publicPath: '../'
            })
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('vue-style', 'css?sourceMap', {
                publicPath: '../'
            })
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
            loader: 'file?name=assets/fonts/[name].[ext]?[hash]'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192&name=assets/images/[name].[hash].[ext]'
        }]
    },
    plugins: plugins,
    debug: !isProd,
    devtool: isProd ? false : 'inline-cheap-module-source-map',
    devServer: {
        contentBase: base + 'build',
        historyApiFallback: true,
        inline: true,
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        },
        host: '0.0.0.0',
        port: 8080
    },
    postcss: function () {
        return [autoprefixer];
    }
};

// if you don't want to rewrite webpack.config.js when add new page , you can try this
//
//  // npm install --save-dev glob
// var glob = require('glob');
// var path = require('path');
// ...
// var getFiles = function(filepath) {
//    var files = glob.sync(filepath);
//    var entries = {};
//    files.forEach(function(item){
//        var pathname = path.basename(item, path.extname(item))
//        entries[pathname] = item;
//    });
//    return entries;
// }
// ...
// ...
// var pages = getFiles('./source/pages/*/*.jade');
// // generate html and inject module
// Object.keys(pages).forEach(function(pageName){
//    plugins.push(
//      new HtmlWebpackPlugin({
//          template: './source/pages/'+ pageName+ '/' + pageName + '.jade',
//          filename: pageName +'.html',
//          chunks: [ 'common', pageName],
//      })
//    );
// });
//
// var entryJs = getFiles('./source/pages/*/*.js');
// ...
// ...
