exports.setup = function(params) {

    var app = params.app;
    var controllers = params.controllers;
    var api_root = '/some/api'; //TODO: /some path should be part of config

    app.get("/some", function(res, res) { 
      res.redirect('/some/admin');
    });

    // Page serving routes
    app.get('*', controllers.front);

    // API routes
    app.all(api_root + '/:section', controllers.route_api);
    app.all(api_root + '/:section/:action', controllers.route_api);
    app.all(api_root + '/:section/:action/:id', controllers.route_api);

};
