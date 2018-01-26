const path = require('path');
//路径模式匹配模块glob
const glob = require('glob');
const webpack = require('webpack');
//https://www.npmjs.com/package/html-webpack-plugin
const htmlWebpackPlugin = require('html-webpack-plugin');
//https://www.npmjs.com/package/clean-webpack-plugin
const CleanWebpackPlugin = require('clean-webpack-plugin');
//https://www.npmjs.com/package/copy-webpack-plugin
const CopyWebpackPlugin = require('copy-webpack-plugin');

//const HashedChunkIdsPlugin = require('./hashedChunkIdsPlugin.js');


//是否是pc编译
var platform = process.env.PLATFORM == 'pc' ? 'pc' : 'app';

//webpack配置
const eslintConfigDir = '../.eslintrc.js';
const postcssConfigDir = './postcss.config.js';
const resolveConfigDir = './resolve.config.js';


//忽略不必要编译的文件
// const entryIgnore = require('./entryignore.json');

//目录配置
const entryDir = path.resolve(__dirname, '../src/' + platform);
const outputDir = path.resolve(__dirname, '../dist/' + platform);

//入口js文件配置以及公共模块配置
const entries = getEntry(entryDir + '/js/**/*.js');
entries.vendors = ['common'];

console.log(entries);


module.exports = {
    /* 输入文件 */
    resolve: require(resolveConfigDir),
    entry: entries,
    output: {
        path: outputDir,
        publicPath: 'http://localhost:8080/',
        filename: 'js/[name].js'
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
            //include:[entryDir + '/js/demo/'],
            //exclude: [entryDir + '/js/components/'],
            options: {
                fix: true //自动修复不符合规则的代码
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: ['env']
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
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
        new CleanWebpackPlugin(outputDir, {
            allowExternal: true
        }),

        //new HashedChunkIdsPlugin(),

        new webpack.HashedModuleIdsPlugin(),

        //载入配置
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: require(eslintConfigDir),
                postcss: require(postcssConfigDir)
            },
        }),

        // 提取公共模块
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors', 'manifest'], // 公共模块的名称
            chunks: 'vendors', // chunks是需要提取的模块
            minChunks: Infinity //公共模块最小被引用的次数
        }),
        //移动库文件
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
                entry.split('/html/')[1].split('.ejs')[0];

            // basename = dirArr.join('/');

            // if (entryIgnore.indexOf(basename) == -1) {
            entries[dirArr] = entry;
            // }

        }
    });

    return entries;
}
