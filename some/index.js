/* Some CMS app setup */
function somecms(params) {
    var app = params.app;
    var mongoose = params.mongoose;
    var express = params.express;

    var models = require('./models')({'mongoose': mongoose});
    
    var controllers = require('./controllers.js')(params);
    
    var routes = require('./routes.js');
    routes.setup({
      'controllers': controllers,
      'app': app
     });

    app.use("/some", express.static(__dirname + '/public'));
}
module.exports = somecms;