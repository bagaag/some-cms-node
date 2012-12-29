function PageController(params) {

    var self = this;
    var mongoose = params.mongoose;
    var utils = params.utils;
    var app = params.app;
    var Pages = mongoose.model('Pages');
    
    /** Documentation */
    this.help = function(req, res) {
        var doc = {};
        doc.list = {
            'description': 'Lists the pages managed by the CMS.',
            'options': [                
            ]
        };
        res.send(doc);
    }
}

module.exports = PageController;