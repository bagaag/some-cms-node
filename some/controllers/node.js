require("url");

function NodeController(app) {

  var self = this;
  var utils = app.some.utils;
  var Node = app.some.model.Node;

  // REST router 
  this.rest = function(req, res) {
    utils.rest_handler(req, res, this);
  };
  
  // Get a single node 
  this.get = function(req, res) {
    var id = req.param('id');
    Node.findById(id, function(err, node) {
      if (err) res.send(500, err);
      else if (node==null) res.send(404);
      else utils.format(app, res, node);
    });
  };

  // List nodes (parent_id specified in querystring, else root nodes)
  this.list = function(req, res) {
    Node.children(req.query, function(err, nodes) {
      if (err) res.send(500, err);
      else res.send(nodes);
    });
  };

  // Update a node (label and children only)
  this.update = function(req, res) {
    var body = req.body;
    var id = req.param('id');
    Node.findById(id, function(err, node) {
      if (err) res.send(500, err);
      else if (node==null) res.send(404);
      else {
        if (body.children) node.set({children: body.children});
        if (body.label) node.set({label: body.label});
        node.save(function(err) {
          if (err) res.send(500, err);
          else res.send(204);
        });
      }
    });
  };
  /* Create and destroy calls should happen through target interactions via NodePlugin */

}

module.exports = NodeController;














