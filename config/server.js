//建立express服务器
const express = require('express');
const path = require("path");
const app = express();
//指定静态文件的位置
app.use('/', express.static(path.resolve(__dirname, '../dist/app')));
//监听端口号
app.listen(8080);
