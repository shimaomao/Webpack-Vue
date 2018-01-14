const layout = require('../layouts/layout.js')
const content = require('./test.ejs')
const pageTitle = 'test'

module.exports = layout.init(pageTitle).run(content({ pageTitle }))
