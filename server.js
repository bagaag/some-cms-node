// global module dependencies
var config = require('./config.js');
var express = require('express');
var cons = require('consolidate');
var app = module.exports = express();

// configure templates & views
app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.use("views", __dirname + '/views');
app.use("/static", express.static(__dirname + '/public'));

// middleware 
//app.use(express.bodyParser()); // parse form posts
//app.use(express.methodOverride()); // allows put/get/post overrides
//app.use(express.router); // enables app.get, app.post, etc.
//app.use(express.cookieDecoder());
//TODO: use connect-mongodb for cross-server sessions
//app.use(express.session());

// load up some CMS
require('./some')({ 'express':express, 'app':app, 'config':config.some });

// an external route
app.get('/', function (req, res) {
    var viewdata = { 'test' : 'Testing a Mustache variable.'};
    res.render('index', viewdata);
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
