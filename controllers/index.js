function controllers(params) {    
    var mongoose = params.mongoose;      
    var Pages = mongoose.model('Pages');
    
    controllers.index = function (req, res) {
        var viewdata = { 'test' : 'Hey now.'};
        res.render('index', viewdata);
    };
    controllers.db = function (req, res) {  
        var Pages = mongoose.model('Pages');
        Pages.find({}, function(err, pages) {
            var viewdata = { 'list' : pages};
            res.render('index', viewdata);
        });
    };

    return controllers;
}
module.exports = controllers;