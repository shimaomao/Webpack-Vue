const path = require("path");
var webpack = require('webpack');
//引入插件 [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)
const htmlWebpackPlugin = require('html-webpack-plugin');
//代码分离插件 https://www.npmjs.com/package/extract-text-webpack-plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");


//webpack配置
//var eslintConfigDir = prod ? './webpack-config/.eslintrc.js' : './webpack-config/.eslintrc.dev.js';
var postcssConfigDir = './config/postcss.config.js';
//var resolveConfigDir = './webpack-config/resolve.config.js';


module.exports = {
    //
    // devtool:'#eval-source-map',
    //程序入口文件  其他详细配置参见http://webpack.github.io/docs/configuration.html#entry
    entry: './src/app/js/activity/test.js',
    //程序出口文件  其他详细配置参见http://webpack.github.io/docs/configuration.html#output
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'js/bundle-[hash:5].js',
        // 用户添加CDN
        // publicPath:'http://cdn.com/'
    },
    // webpack-dev-server配置 详见https://webpack.js.org/configuration/dev-server/
    devServer: {
        //设置服务器主文件夹，默认情况下，从项目的根目录提供文件
        contentBase: path.resolve(__dirname, "dist"),
        //开启gzip压缩
        compress: true,
        //使用inlilne模式
        inline: true,
        // //当编译错误的时候，网页上显示错误信息
        // overlay: {
        //   warnings: true,
        //   errors: true
        // },
        //设置域名，默认是localhost
        // host: "10.74.138.249",
        // port: 3000
    },

    module: {
        rules: [{
            test: /\.js$/,
            include: [
                path.resolve(__dirname, "src")
            ],
            loader: 'babel-loader',
            query: {
                presets: ['env']
            }
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader']),
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                query: {
                    name: 'img/[name]-[hash:5].[ext]'
                }
            }]
        }]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                //eslint: require( eslintConfigDir ),
                postcss: require(postcssConfigDir)
            },
        }),
        new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),
        new htmlWebpackPlugin({
            template: 'src/app/index.html',
            inject: 'body',
            title: 'this is a demo'
            // minify: {
            //   removeComments: true,
            //   collapseWhitespace: true
            // }

        }),

    ]
}
