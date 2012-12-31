exports.setup = function(params) {
    var app = params.app;
    var controllers = params.controllers;
    var api_root = '/some/api'; //TODO: /some path should be part of config

    // Page serving routes
    app.get('*', controllers.front);

    // API routes
    app.get(api_root + '/:section', controllers.route_api);
    app.get(api_root + '/:section/:action', controllers.route_api);
    app.get(api_root + '/:section/:action/:param', controllers.route_api);
    

};