function PageAPI(params) {

    var self = this;
    var db = params.db;
    var Pages = db.model('Pages');

    /** List pages */
    this.list = function(opts, callback) {
        Pages.find({}, function(err, pages) {
            callback(err, pages);
        });
    };
}

module.exports = PageAPI;