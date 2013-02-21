/* Some CMS app setup */
function some(app) {

  // set an app pointer
  app.some = this;

  // mongoose connection can be pre-existing or not
  if (!app.mongoose) {
    // sets app.mongoose
    require('./lib/db')(app);
  }

  // schema setup
  require('./lib/models')(app);

  // API setup
  var PageAPI = require('./lib/api_page.js');
  app.some.pages = new PageAPI(app);
  var NodeAPI = require('./lib/api_node.js');
  app.some.nodes = new NodeAPI(app);

  // middleware setup
  require('./lib/middleware.js')(app);

  // controllers setup
  var Controllers = require('./controllers.js');
  app.controllers = new Controllers(app);
  
  // configure routes
  var routes = require('./routes.js');
  routes.setup(app);

  // configure static folder
  app.use("/some", app.express.static(__dirname + '/public'));

}
module.exports = some;
