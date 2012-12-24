var express = require('express')
  , cons = require('consolidate')
  , app = express();

// assign the swig engine to .html files
app.engine('html', cons.mustache);

// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// test mustache
app.get('/', function(req, res){
  var viewdata = { 'test' : 'Hey now.'};
  res.render('index', viewdata);
});

if (!process.env.PORT) { // provided by c9.io environment
    process.env.PORT = 3000;
}
app.listen(process.env.PORT);
console.log('Express server listening on port ' + process.env.PORT);
