function PageController(params) {

    var self = this;
    var utils = params.utils;
    var app = params.app;
    var PageAPI = require('../lib/api_page.js');
    var pageAPI = new PageAPI(params);
    
    
    /** List pages */
    this.list = function(req, res) {
        pageAPI.list({}, function(err, pages) {
            var viewdata = {
                'pages': pages
            };
            utils.format(app, res, viewdata);
        });
    };
}

module.exports = PageController;