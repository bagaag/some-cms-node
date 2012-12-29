// sets up the parent site

function mysite(params) {
    var app = params.app;
    var express = params.express;

    var controllers = require('./controllers')({});
    var routes = require('./routes.js');
    routes.setup({
      'controllers': controllers,
      'app': app
     });
    app.set('views', __dirname + '/views');
     
    app.use(express.static(__dirname + '/public'));
     
}
module.exports = mysite;
