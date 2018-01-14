const layout = require('./layout.ejs')

/* 整理渲染公共部分所用到的模板变量 */
const app = {
    domain: 'localhost:8080',
    packageId:2
}

const moduleExports = {
 	/* 处理各个页面传入而又需要在公共区域用到的参数 */
	init(pageTitle) {
		app.pageTitle = pageTitle;
		return this
	},
 	/* 整合各公共组件和页面实际内容，最后生成完整的HTML文档 */
	run(content) {
		const renderData = {
			content: content,
			app: app
		}
		return layout(renderData)
	},
}

module.exports = moduleExports
