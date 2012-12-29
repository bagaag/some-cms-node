function controllers(params) {    
    
    controllers.index = function (req, res) {
        var viewdata = { 'test' : 'Testing a Mustache variable.'};
        res.render('index', viewdata);
    };

    return controllers;
}
module.exports = controllers;