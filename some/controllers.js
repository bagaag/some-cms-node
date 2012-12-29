function controllers(params) {
    
    var someutils = require('./lib/someutils');
    params.utils = someutils;

    var controller_classes = {
        'page': require('./controllers/page')
       ,'test': require('./controllers/test')
    };

    // direct /some/:section/:action to the approriate controller and method 
    controllers.route_api = function(req, res) {
        var section = req.params.section;
        var action = req.params.action;
        if (!action) action = 'index';
        var ControllerClass = controller_classes[section];
        if (typeof ControllerClass == 'undefined') {
            res.send("Unmapped API section '" + section + "'", 404);
            return;
        }
        var controller = new ControllerClass(params);
        if (typeof controller[action]=='undefined') {
            res.send("Unmapped API action: '" + section + '/' + action + "'", 404);
            return;
        } else {
            controller[action](req, res);
        }
    }
    
    return controllers;
}
module.exports = controllers;