function PageController(params) {

    var self = this;
    var mongoose = params.mongoose;
    var utils = params.utils;
    var app = params.app;
    var Pages = mongoose.model('Pages');
    
    
    /** List pages */
    this.list = function(req, res) {
        Pages.find({}, function(err, pages) {
            var viewdata = {
                'pages': pages
            };
            utils.format(app, res, viewdata);
        });
    };
}

module.exports = PageController;