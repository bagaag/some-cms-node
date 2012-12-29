exports.setup = function(params) {
    var app = params.app;
    var controllers = params.controllers;

    // Routes
    app.get('/some/api/:section', controllers.route_api)
    app.get('/some/api/:section/:action', controllers.route_api)
    app.get('/some/api/:section/:action/:param', controllers.route_api)
};