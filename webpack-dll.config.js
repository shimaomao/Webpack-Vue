var path = require('path');
var webpack = require('webpack');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var HashedChunkIdsPlugin = require('./config/hashedChunkIdsPlugin.js');

//是否是pc编译
var isPc = process.env.PLATFORM == 'pc' ? true : false;

//webpack配置
//var postcssConfigDir = './config/postcss.config.js';
var resolveConfigDir = './config/resolve.config.js';

if (isPc) {
    var baseEntryDir = './static_guojiang_tv/src/pc/v4/';
    var entryDir = baseEntryDir + '**/*.js';
    var outDir = path.resolve(__dirname, './static_guojiang_tv/src/pc/v4');
    var outPublicDir = 'http://static.guojiang.tv/pc/v4/';
    var entries = ['vue', 'axios', 'layer', 'jquery'];
    var dll_manifest_name = 'dll_manifest_pc';
} else {
    var baseEntryDir = './src/app/';
    var entryDir = baseEntryDir + '**/*.js';
    var outDir = path.resolve(__dirname, './src/app/');
    var outPublicDir = 'http://static.cblive.tv/dist/app/';
    var entries = ['vue', 'axios', 'flexible'];
    var dll_manifest_name = 'dll_manifest';
}


module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: {
        dll: entries
    },
    output: {
        path: outDir,
        publicPath: outPublicDir,
        filename: 'js/dll/[name].js?v=[chunkhash:8]',
        library: '[name]_library',
        /*libraryTarget: 'umd'*/
    },
    module: {
        rules: [{
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                include: path.resolve(__dirname, entryDir),
                exclude: [baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
            }
            // ,{
            //     test: /\.css$/,
            //     use: ['style-loader', 'css-loader', 'postcss-loader'],
            //     exclude: [baseEntryDir + 'css/lib']
            // }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        //压缩JS代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            //sourceMap: true,
            output: {
                comments: false, // 去掉注释内容
            }
        }),

        // new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),
        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         postcss: require(postcssConfigDir)
        //     },
        // }),
        // //压缩css代码
        // new OptimizeCssAssetsPlugin({
        //     assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
        //     cssProcessor: require('cssnano'),
        //     cssProcessorOptions: { discardComments: { removeAll: true } },
        //     canPrint: true
        // }),

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
