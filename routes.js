exports.setup = function(params) {
    var app = params.app;
    var controllers = params.controllers;

    // Routes
    app.get('/', controllers.index);   
    app.get('/db', controllers.db);   
};