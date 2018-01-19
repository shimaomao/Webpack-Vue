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

const HashedChunkIdsPlugin = require('./config/hashedChunkIdsPlugin.js');



//是否是生产环境
var prod = process.env.NODE_ENV === 'production' ? true : false;
//是否是pc编译
var platform = process.env.PLATFORM == 'pc' ? 'pc' : 'app';

//webpack配置
var eslintConfigDir = prod ? './config/.eslintrc.js' : './config/.eslintrc.dev.js';
var postcssConfigDir = './config/postcss.config.js';
var resolveConfigDir = './config/resolve.config.js';

//忽略不必要编译的文件
// var entryIgnore = require('./entryignore.json');

//目录配置
console.log('现在是' + platform + '编译:');

var baseEntryDir = './src/' + platform + '/js/';
var entryDir = baseEntryDir + '**/*.js';
var outputDir = path.resolve(__dirname, './dist/' + platform + '/');
// var outputPublicDir = 'http://static.joylive.tv/dist/pc/';
var basePageEntry = './src/' + platform + '/html/';
var basePageOutput = './dist/' + platform + '/html/';
//需要清除的目录
var cleanDir = [
    path.resolve(__dirname, './dist/' + platform + '/')
];

var dll_manifest_name = 'dll_manifest_' + platform;

//入口js文件配置以及公共模块配置
var entries = getEntry(entryDir);
entries.vendors = ['common'];

console.log(entries);

module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: entries,
    output: {
        path: outputDir,
        // publicPath: outputPublicDir,
        filename: 'js/[name].js?v=[chunkhash:8]'
    },
    devServer: {
        //设置服务器主文件夹，默认情况下，从项目的根目录提供文件
        contentBase: path.resolve(__dirname, "dist/"+platform+"/"),
        open: true,
        //开启gzip压缩
        compress: true,
        //使用inlilne模式
        inline: true,
        // //当编译错误的时候，网页上显示错误信息
        overlay: {
            warnings: true,
            errors: true
        },
        //设置域名，默认是localhost
        host: "localhost",
        port: 8080
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
        }, {
            test: /\.js$/,
            enforce: 'pre',
            loader: 'eslint-loader',
            include: path.resolve(__dirname, entryDir),
            exclude: [baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
            options: {
                fix: true
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: ['env']
            },
            exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
            exclude: [baseEntryDir + 'css/lib']
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
        }]
    },
    plugins: [
        new HashedChunkIdsPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        // new webpack.DllReferencePlugin({
        //     // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
        //     context: __dirname,
        //     // 指定manifest.json
        //     manifest: require('./' + dll_manifest_name + '.json'),
        //     // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
        //     name: 'dll_library',
        // }),


        new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: require(eslintConfigDir),
                postcss: require(postcssConfigDir)
            },
        }),

        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors', 'manifest'], // 公共模块的名称
            //filename: 'js/vendors-[hash:6].js', // 公共模块的名称
            chunks: 'vendors', // chunks是需要提取的模块
            minChunks: Infinity //公共模块最小被引用的次数
        }),
        new CopyWebpackPlugin([
            { from: baseEntryDir + '/lib', to: 'js/lib' },
        ])
    ]
};

/***** 生成组合后的html *****/

var pages = getEntry(basePageEntry + '**/*.ejs');
for (var pathname in pages) {
    var conf = {
        // html模板文件输入路径
        template: path.resolve(__dirname, basePageEntry + pathname + '.js'),
        // html文件输出路径
        filename: path.resolve(__dirname, basePageOutput + pathname + '.html'),
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
                entry.split(basePageEntry)[1].split('.ejs')[0];

            // basename = dirArr.join('/');

            // if (entryIgnore.indexOf(basename) == -1) {
            entries[dirArr] = entry;
            // }

        }
    });

    return entries;
}


/***** 区分开发环境和生产环境 *****/

if (prod) {
    console.log('当前编译环境：production');
    module.exports.plugins = module.exports.plugins.concat([
        new CleanWebpackPlugin(cleanDir),
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
            //sourceMap: true,
            output: {
                comments: false, // 去掉注释内容
            }
        })
    ]);
} else {
    console.log('当前编译环境：dev');
    module.exports.devtool = '#cheap-module-eval-source-map';
}
