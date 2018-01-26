const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

//是否是pc编译
var platform = process.env.PLATFORM == 'pc' ? 'pc' : 'app';
console.log('现在是' + platform + '编译:');
console.log('当前编译环境：production');
var dll_manifest_name = 'dll_manifest_' + platform;


module.exports = merge(base, {
    output: {
        //publicPath: 'http://localhost:8080/',
        filename: 'js/[name].js?v=[chunkhash:8]'
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader']),
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),

        //new HashedChunkIdsPlugin(),
        //new webpack.HashedModuleIdsPlugin(),
        new webpack.DllReferencePlugin({
            // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
            // 指定manifest.json
            manifest: require('../' + dll_manifest_name + '.json'),
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
            name: 'dll_library',
        }),

        new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),
        //压缩css代码
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                // 避免 cssnano 重新计算 z-index
                safe: true
            },
            canPrint: true
        }),
        //压缩JS代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        }),

    ]
});
