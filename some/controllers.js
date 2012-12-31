function Controllers(params) {
    
    var someutils = require('./lib/someutils');
    params.utils = someutils;

    // define API controllers
    //TODO: support custom API controllers as modules
    var controllers = {
        'page': require('./controllers/page')
       ,'test': require('./controllers/test')
    };
    
    // instantiate API controllers
    for (var name in controllers) {
        controllers[name] = new controllers[name](params);
    }
    
    // front-end request controller
    var FrontController = require('./controllers/front');
    var front_controller = new FrontController(params);

    // direct /some/:section/:action to the approriate controller and method 
    Controllers.route_api = function(req, res, next) {
        var section = req.params.section;
        var action = req.params.action;
        if (!action) action = 'index';
        var controller = controllers[section];
        if (typeof controller == 'undefined') {
            res.send("Unmapped API section '" + section + "'", 404);
            return;
        }
        if (typeof controller[action]=='undefined') {
            res.send("Unmapped API action: '" + section + '/' + action + "'", 404);
            return;
        } else {
            controller[action](req, res, next);
        }
    };
    
    // front-end content requests
    Controllers.front = function(req, res, next) {
        front_controller.display(req, res, next);        
    };
    
    return Controllers;
}
module.exports = Controllers;