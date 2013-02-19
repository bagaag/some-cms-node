function PageController(params) {

  var self = this;
  var utils = params.utils;
  var app = params.app;
  var PageAPI = require('../lib/api_page.js');
  var pageAPI = new PageAPI(params);
  var NodeAPI = require('../lib/api_node.js');
  var nodeAPI = new NodeAPI(params);

  // REST router 
  this.rest = function(req, res) {
    utils.rest_handler(req, res, this);
  };
  
  // Get a single page 
  this.get = function(req, res) {
    var id = req.param('id');
    pageAPI.get(id, function(err, page) {
      if (err) res.send(500, err);
      else utils.format(app, res, page);
    });
  };

  // List pages 
  this.list = function(req, res) {
    pageAPI.list(req.body, function(err, pages) {
      if (err) res.send(500, err);
      else res.send(pages);
    });
  };

  // Create a page
  this.create = function(req, res) {
    var data = req.body;
    pageAPI.create(data, function(err, page) {
      if (err) res.send(500, err);
      else {
        function finished() {
          res.set('Location', (req.secure?'https':'http')+'://'+req.host+'/some/api/page/rest/'+page.id);
          res.send(201);
        }
        // create node
        var node = { target_type: 'some_pages', target_id: page._id, label: page.title, children:[] };
        if (typeof data.parent == 'undefined') node.root = true;
        else node.parent_id = data.parent;
        nodeAPI.create(node, function(err, page) {
          if (err) res.send(500, err);
          else {
            finished();
          }
        });
      }
    });
  };

  // Update a page
  this.update = function(req, res) {
    var body = req.body;
    body._id = req.param('id');
    pageAPI.update(req.body, function(err) {
      if (err) res.send(500, err);
      else {
        nodeAPI.update_label(body._id, body.title, function(err, node) {
          res.send(204);
        });
      }
    });
  };

  // Delete a page
  this.destroy = function(req, res) {
    pageAPI.destroy(req.param('id'), function(err) {
      if (err) res.send(500, err);
      else res.send(204);
    });
  };

}

module.exports = PageController;














