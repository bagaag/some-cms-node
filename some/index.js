/* Some CMS app setup */
function some(app) {

  // set an app pointer
  app.some = this;

  // setup utils collection
  app.some.utils = require('./lib/someutils');

  // mongoose connection can be pre-existing or not
  if (!app.mongoose) {
    // sets app.mongoose
    require('./lib/db')(app);
  }

  // schema setup
  require('./models')(app);

  // controllers setup
  var Controllers = require('./controllers');
  app.controllers = new Controllers(app);
  
  // configure routes
  var routes = require('./routes.js');
  routes.setup(app);

  // configure static folder
  app.use("/some", app.express.static(__dirname + '/public'));

  // TODO: configure logging
  //app.use("/some", function(req, res, next) { console.log(req.path); next(); });
}
module.exports = some;
