const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.js');

const platform = process.env.PLATFORM == 'pc' ? 'pc' : 'app';
//目录配置
const entryDir = path.resolve(__dirname, '../src/' + platform);
const outputDir = path.resolve(__dirname, '../dist/' + platform);

console.log('现在是' + platform + '编译:');
console.log('当前编译环境：development');

module.exports = merge(base, {
    devtool: 'inline-source-map', //cheap-module-eval-source-map
    devServer: {
        //设置服务器主文件夹，默认情况下，从项目的根目录提供文件
        contentBase: outputDir,
        //自动开启默认浏览器
        //open: true,
        //开启热模块替换,只重载页面中变化了的部分
        hot: true,
        //hotOnly:true,
        //开启gzip压缩
        compress: true,
        //使用inlilne模式,会触发页面的动态重载
        inline: true,
        //当编译错误的时候，网页上显示错误信息
        overlay: {
            warnings: true,
            errors: true
        },
        //浏览器自动打开的文件夹
        //openPage: 'html/',
        //只在shell中展示错误信息
        //stats: 'errors-only',
        //设置域名，默认是localhost
        host: 'localhost',
        port: 8080
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
            include: [entryDir],
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        //热模块替换插件
        new webpack.HotModuleReplacementPlugin()

    ]
});
