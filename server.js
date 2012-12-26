// database connection
var config = require('./config.js');
var mongoose = require('mongoose');
mongoose.connect(config.db.mongodb);

// module dependencies
var express = require('express');
var routes = require('./routes.js');
var models = require('./models')({mongoose: mongoose});
var cons = require('consolidate');
var controllers = require('./controllers')({mongoose: mongoose});
var app = module.exports = express();

// configure templates & views
app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// middleware 
//app.use(express.bodyParser()); // parse form posts
//app.use(express.methodOverride()); // allows put/get/post overrides
//app.use(express.router); // enables app.get, app.post, etc.
app.use(express.static(__dirname + '/public'));

// routes
routes.setup({
  'controllers': controllers,
  'app': app
 });

// configure error handling
if (app.get('env')=='development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
} else {
  app.use(express.errorHandler());
}

// start server
if (process.env.PORT) { // provided by c9.io environment
    config.server.port = process.env.PORT;
}
app.listen(config.server.port);
console.log('Express server listening on port ' + config.server.port);
