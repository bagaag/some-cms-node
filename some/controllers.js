function Controllers(params) {
    
    var someutils = require('./lib/someutils');
    params.utils = someutils;

    // define API controllers
    var controllers = {};
    var ControllerClasses = {
        'page': require('./controllers/page')
       ,'test': require('./controllers/test')
    };
    
    // add custom controllers
    var custom_api_controllers = params.custom_api_controllers;
    for (var name in custom_api_controllers) {
        ControllerClasses[name] = custom_api_controllers[name];
    }
    
    // instantiate API controllers
    for (name in ControllerClasses) {
        controllers[name] = new ControllerClasses[name](params);
    }
    
    // front-end request controller
    var FrontController = require('./controllers/front');
    var front_controller = new FrontController(params);

    // direct /some/:section/:action to the approriate controller and method 
    this.route_api = function(req, res, next) {
        var section = req.params.section;
        var action = req.params.action;
        if (!action) action = 'index';
        var controller = controllers[section];
        if (typeof controller == 'undefined') {
            res.send(404, someutils.error("Unmapped API section '" + section + "'"));
            return;
        }
        if (typeof controller[action]=='undefined') {
            res.send(404, someutils.error("Unmapped API action: '" + section + '/' + action + "'"));
            return;
        } else {
            controller[action](req, res, next);
        }
    };
    
    // front-end content requests
    this.front = function(req, res, next) {
        front_controller.display(req, res, next);        
    };
    
}
module.exports = Controllers;
