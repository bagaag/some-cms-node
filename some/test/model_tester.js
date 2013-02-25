// Sets up test environment for the model code
function init(app) {
  app.config = require('../../config.js');
  app.some = {};
  app.some.utils = require('../lib/someutils');
  require('../lib/db')(app);
  require('../models')(app);
}
module.exports = init;
