/**
 * Gulp任务
 */
'use strict';
var gulp = require('gulp');
var util = require("gulp-util");
var webpack = require('webpack');
var WebPackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

var devStats = {
    colors: true,
    reasons: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false,
    cached: false,
    cachedAssets: false,
    children: false,
    warning: false
};

// 本地开发模式,webpack-dev-server方式
gulp.task('serve', function (callback) {
    var devConfig = Object.create(webpackConfig);
    devConfig.debug = true;
    devConfig.devtool = 'eval';

    var serverConfig = {
        hot: true,
        contentBase: 'src',
        publicPath: devConfig.output.publicPath,
        stats: devStats
    };
    var compiler = webpack(devConfig);
    new WebPackDevServer(compiler, serverConfig)
        .listen(8080, 'localhost', function (err) {
            if (err) throw new util.PluginError('webpack-dev-server', err);
            util.log('[webpack-dev-server]', 'http://localhost:8080');
        });
});

gulp.task('default', ['serve']);