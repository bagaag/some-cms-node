// module dependencies
var express = require('express')
  , cons = require('consolidate')
  , config = require('./config.js')
  , mongoose = require('mongoose')
  , models = require('./models')({ mongoose: mongoose })
  , app = module.exports = express();

// configure templates & views
app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// connect db
mongoose.connect(config.db.mongodb);

// test mustache
app.get('/', function(req, res){
  var viewdata = { 'test' : 'Hey now.'};
  res.render('index', viewdata);
});

// test mongohq
app.get('/db', function(req, res){
  var Pages = mongoose.model('Pages');
  Pages.find({}, function(err, pages) {
    var viewdata = { 'list' : pages};
    res.render('index', viewdata);
  });
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
