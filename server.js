// database connection 
var config = require('./config.js');
var mongoose = require('mongoose');
mongoose.connect(config.db.mongodb);

// global module dependencies
var express = require('express');
var cons = require('consolidate');
var app = module.exports = express();

// configure templates & views
//TOOD: remove mustache as global dependency
app.engine('html', cons.mustache);
app.set('view engine', 'html');

// middleware 
//app.use(express.bodyParser()); // parse form posts
//app.use(express.methodOverride()); // allows put/get/post overrides
//app.use(express.router); // enables app.get, app.post, etc.
//app.use(express.cookieDecoder());
//TODO: use connect-mongodb for cross-server sessions
//app.use(express.session());

// load up some CMS
var some = require('./some')({ 'express':express, 'app':app, 'mongoose':mongoose, 'config':config.some });

// load parent site
var site = require('./site')({'app':app, 'mongoose':mongoose, 'express':express, 'some':some });

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
