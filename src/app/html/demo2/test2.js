const layout = require('../layouts/layout.js');
const content = require('./test2.ejs');
const pageTitle = 'test2';

module.exports = layout.init(pageTitle).run(content({ pageTitle }));
