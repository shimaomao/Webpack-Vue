const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HashedChunkIdsPlugin = require('./hashedChunkIdsPlugin.js');

//是否是pc编译
const isPc = process.env.PLATFORM == 'pc' ? true : false;

//webpack配置
const resolveConfigDir = './resolve.config.js';

if (isPc) {
    var baseEntryDir = '../src/pc/';
    // var entryDir = baseEntryDir + '**/*.js';
    var outputDir = path.resolve(__dirname, '../src/pc/');
    //var outPublicDir = 'http://static.guojiang.tv/pc/v4/';
    var entries = ['vue', 'axios', 'jquery'];
    var dll_manifest_name = 'dll_manifest_pc';
} else {
    var baseEntryDir = '../src/app/';
    //var entryDir = baseEntryDir + '**/*.js';
    var outputDir = path.resolve(__dirname, '../src/app/');
    //var outPublicDir = 'http://static.cblive.tv/dist/app/';
    var entries = ['vue', 'axios', 'flexible', 'webpack-zepto'];
    var dll_manifest_name = 'dll_manifest_app';
}


module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: {
        dll: entries
    },
    output: {
        path: outputDir,
        //publicPath: outPublicDir,
        filename: 'js/lib/[name].js?v=[chunkhash:8]',
        library: '[name]_library',
        /*libraryTarget: 'umd'*/
    },
    module: {
        rules: [{
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                //include: path.resolve(__dirname, entryDir),
                //exclude: [baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                // exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CleanWebpackPlugin([ outputDir +'/js/lib'],{
            allowExternal: true
        }),
        //压缩JS代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            //sourceMap: true,
            output: {
                comments: false
            }
        }),

        //keep module.id stable when vender modules does not change
        new HashedChunkIdsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllPlugin({
            // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
            path: dll_manifest_name + '.json',
            //当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与参数output.library保持一致
            name: '[name]_library',
            // 指定一个路径作为上下文环境，需要与DllReferencePlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
        })
    ]
};
