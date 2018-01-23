const path = require("path");
//路径模式匹配模块glob
const glob = require('glob');
const webpack = require('webpack');
//html模板插件 详见https://www.npmjs.com/package/html-webpack-plugin
const htmlWebpackPlugin = require('html-webpack-plugin');
//代码分离插件 详见https://www.npmjs.com/package/extract-text-webpack-plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//https://www.npmjs.com/package/clean-webpack-plugin
const CleanWebpackPlugin = require('clean-webpack-plugin');
//https://www.npmjs.com/package/optimize-css-assets-webpack-plugin
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//https://www.npmjs.com/package/copy-webpack-plugin
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HashedChunkIdsPlugin = require('./hashedChunkIdsPlugin.js');



//是否是pc编译
var platform = process.env.PLATFORM == 'pc' ? 'pc' : 'app';
console.log('现在是' + platform + '编译:');
console.log('当前编译环境：production');

//webpack配置
var postcssConfigDir = './postcss.config.js';
var resolveConfigDir = './resolve.config.js';

//忽略不必要编译的文件
// var entryIgnore = require('./entryignore.json');

//目录配置

var entryDir = path.resolve(__dirname, '../src/' + platform);
var outputDir = path.resolve(__dirname, '../dist/' + platform);


var dll_manifest_name = 'dll_manifest_' + platform;

//入口js文件配置以及公共模块配置
var entries = getEntry(entryDir + '/js/**/*.js');
entries.vendors = ['common'];

console.log(entries);


module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: entries,
    output: {
        path: outputDir,
        publicPath: 'http://localhost:8080/',
        filename: 'js/[name].js?v=[chunkhash:8]'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    postcss: [require(postcssConfigDir)]
                }
            }, {
                test: /\.ejs$/,
                loader: 'ejs-loader'
            },{
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
                exclude: [entryDir + '/css/lib']
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader']),
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 5120,
                    name: function(p) {
                        let tem_path = p.split(/\\img\\/)[1];
                        tem_path = tem_path.replace(/\\/g, '/');
                        return 'img/' + tem_path + '?v=[hash:8]';
                    }
                }
            }, {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }],
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CleanWebpackPlugin(outputDir, {
            allowExternal: true
        }),

        new HashedChunkIdsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DllReferencePlugin({
            // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            context: __dirname,
            // 指定manifest.json
            manifest: require('../' + dll_manifest_name + '.json'),
            // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
            name: 'dll_library',
        }),

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
                comments: false, // 去掉注释内容
            }
        }),
        new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: require(postcssConfigDir)
            },
        }),

        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors', 'manifest'], // 公共模块的名称
            chunks: 'vendors', // chunks是需要提取的模块
            minChunks: Infinity //公共模块最小被引用的次数
        }),
        new CopyWebpackPlugin([
            { from: entryDir + '/js/lib', to: 'js/lib' },
        ])
    ]
};

/***** 生成组合后的html *****/

var pages = getEntry(entryDir + '/html/**/*.ejs');
for (var pathname in pages) {
    var conf = {
        // html模板文件输入路径
        template: entryDir + '/html/' + pathname + '.js',
        // html文件输出路径
        filename: outputDir + '/html/' + pathname + '.html',
        inject: true,
        cache: true, //只改动变动的文件
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    };
    //根据chunks提取页面js,css和公共verdors
    if (pathname in module.exports.entry) {
        conf.chunks = [pathname, 'vendors'];
    } else {
        conf.chunks = ['vendors'];
    }

    module.exports.plugins.push(new htmlWebpackPlugin(conf));
}


/**
 * [获取文件列表(仅支持js和ejs文件)：输出正确的js和html路径]
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function getEntry(globPath) {
    var entries = {};
    glob.sync(globPath).forEach(function(entry) {
        //排出layouts内的公共文件
        if (entry.indexOf('layouts') == -1 && entry.indexOf('lib') == -1 && entry.indexOf('components') == -1) {

            //判断是js文件还是html模板文件
            let isJsFile = entry.indexOf('.js') !== -1;
            let dirArr = isJsFile ?
                entry.split('/js/')[1].split('.js')[0] :
                entry.split(entryDir + '/html/')[1].split('.ejs')[0];

            // basename = dirArr.join('/');

            // if (entryIgnore.indexOf(basename) == -1) {
            entries[dirArr] = entry;
            // }

        }
    });

    return entries;
}
