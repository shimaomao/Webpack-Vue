const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');


//webpack配置
const resolveConfigDir = './resolve.config.js';
let platform = process.env.PLATFORM == 'pc' ? 'pc' : 'app';
let baseEntryDir = '../src/'+platform+'/';
let outputDir = path.resolve(__dirname, '../src/'+platform+'/');
let dll_manifest_name = 'dll_manifest_'+platform;
let entries = platform == 'pc' ? ['vue', 'axios', 'jquery'] : ['vue', 'axios', 'flexible', 'webpack-zepto'];


module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: {
        dll: entries
    },
    output: {
        path: outputDir,
        filename: 'js/lib/[name].js',
        library: '[name]_library',
        /*libraryTarget: 'umd'*/
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CleanWebpackPlugin([outputDir + '/js/lib'], {
            allowExternal: true
        }),
        //压缩JS代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),

        //稳定模块ID
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
