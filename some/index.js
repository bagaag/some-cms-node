/* Some CMS app setup */
function somecms(params) {
    var app = params.app;
    var express = params.express;
    params.db = require('./lib/db');
    var controllers = require('./controllers.js')(params);
    
    var routes = require('./routes.js');
    routes.setup({
      'controllers': controllers,
      'app': app
     });

    app.use("/some", express.static(__dirname + '/public'));
}
module.exports = somecms;