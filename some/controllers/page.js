function PageController(app) {

  var self = this;
  var utils = app.some.utils;
  var Node = app.some.model.Node;
  var Page = app.some.model.Page;

  // REST router 
  this.rest = function(req, res) {
    utils.rest_handler(req, res, this);
  };
  
  // Get a single page 
  this.get = function(req, res) {
    var id = req.param('id');
    Page.findById(id, function(err, page) {
      if (err) res.send(500, err);
      else if (page==null) res.send(404);
      else utils.format(app, res, page);
    });
  };

  // List pages 
  this.list = function(req, res) {
    Page.find(req.body, function(err, pages) {
      if (err) res.send(500, err);
      else res.send(pages);
    });
  };

  // Create a page
  this.create = function(req, res) {
    var data = req.body;
    var page = new Page(data);
    page.save(function(err) {
      if (err) res.send(500, err);
      else {
        res.set('Location', (req.secure?'https':'http')+'://'+req.host+'/some/api/page/rest/'+page.id);
        res.send(201);
      }
    });
  };

  // Update a page
  this.update = function(req, res) {
    var body = req.body;
    var id = req.param('id');
    Page.findById(id, function(err, page) {
      if (err) res.send(500, err);
      else if (page==null) res.send(404);
      else {
        page.set(body);
        page.save(function(err) {
          if (err) res.send(500, err);
          else res.send(204);
        });
      }
    });
  };

  // Delete a page
  this.destroy = function(req, res) {
    var id = req.param('id');
    Page.findById(id, function(err, page) {
      if (err) res.send(500, err);
      else if (page==null) res.send(404);
      else {
        page.remove(function(err) {
          res.send(204);
        });
      }
    });
  };

}

module.exports = PageController;














