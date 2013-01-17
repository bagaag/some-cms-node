function PageAPI(params) {

    var self = this;
    var db = params.db;
    var Page = db.model('Page');

    // List pages 
    this.get = function(id, callback) {
      Page.findById(id, callback);
    };

    // List pages
    this.list = function(opts, callback) {
        Page.find({}, function(err, pages) {
            callback(err, pages);
        });
    };

    // Set page properties
    this.update_from_obj = function(model, obj) {
      model.set('title', obj.title);
      model.set('body', obj.body);
    };

    // Create a page 
    this.create = function(p, callback) {
      if (!p.title || p.title==='') {
        callback('missing required field: title');
        return;
      }
      var page = new Page();
      self.update_from_obj(page, p);
      page.save(function(err){
        if (err) callback(err);
        else callback(undefined, page);
      });
    };

    // Update a page
    this.update = function(p, callback) {
      self.get(p._id, function(err, page) {
        if (err) callback(err);
        else if (page==null) callback('Page not found');
        else {
          self.update_from_obj(page, p);
          page.save(callback);
        }
      });
    };

    // Destroy a page 
    this.destroy = function(id, callback) {
      self.get(id, function(err, page) {
        if (err) callback(err);
        else if (page==null) callback(new Error('Page not found'));
        else {
          page.remove(callback);
        }
      });
    };
}

module.exports = PageAPI;

