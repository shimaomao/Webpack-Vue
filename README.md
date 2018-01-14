1. 生成dll.js
dll.js中打包的是常用的库文件，这里打包了vue2.5.13,axios0.17.1
具体可参考[如何生成dll](https://segmentfault.com/a/1190000005969643)
若有必要可考虑生成dll.css


是否需要eslint-loader
vue在dll中是生产环境不方便调试
webpack-dev-server只能读取内存中的内容
