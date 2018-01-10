var path = require('path');

var pcBaseEntryDir = '../src/pc/';
var mobileBaseEntryDir = '../src/app/';

var baseEntryDir = process.env.PLATFORM == 'pc' ? pcBaseEntryDir : mobileBaseEntryDir;


module.exports = {
    // 模块别名的配置，为了使用方便，一般来说所有模块都是要配置一下别名的
    alias: {
        'vue': path.resolve(__dirname, './../node_modules/vue/dist/vue.esm.js'),
        'axios': path.resolve(__dirname, './../node_modules/axios/dist/axios.min.js'),
        'webpack-zepto': path.resolve(__dirname, './../node_modules/webpack-zepto/index.js'),
        'flexible': path.resolve(__dirname, './../node_modules/gj-flexible/index.js'),
        'common': path.resolve(__dirname, baseEntryDir + 'js/common/common.js')
    },

    // 当require的模块找不到时，尝试添加这些后缀后进行寻找
    extensions: ['.js', '.css', '.less', '.vue', '.json'],
}
