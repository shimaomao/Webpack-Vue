### 如何使用
#### 1. 克隆并安装依赖
执行git clone https://github.com/Jesse121/Webpack-Vue.git 下载本项目

执行yarn install 安装相关依赖包
#### 2. 打包库文件
执行yarn dll

在src源文件夹中的js/lib/目录下生成dll.js
该库文件中包含vue@2.5 axios@0.17 移动端的dll.js中按包含了zepto，pc端的dll.js中包含jquery
在src下的app或pc中建立相应的静态文件(html,js,css)，该目录下有demo可参考
#### 3. 项目开发过程中
执行yarn dev

将src下源文件进行编译并能通过静态服务器输出（以dist下app或pc为输出目录，在demo中可直接访问[http://localhost/html/demo/test.html](http://localhost/html/demo/test.html))，可实时浏览方便调试。此步骤中并未输出dist文件夹而是通过在内存中进行代码的编译和资源的提供，以提高性能.
#### 4. 项目开发完成，输出打包文件
执行yarn build

将src下源码编译并输出，目录下会生成dist文件夹，该文件夹中包含打包后的静态文件

#### 遗留问题

* ejs不能热更新
* .babelrc文件是否需要
* Sublime​Linter-contrib-eslint_d插件的安装使用在mac上无效
* 自动化测试框架






