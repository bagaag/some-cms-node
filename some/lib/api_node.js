function NodeAPI(params) {

    var self = this;
    var db = params.db;
    var Node = db.model('Node');

    // Fetch node by ID
    this.get = function(id, callback) {
      Node.findById(id, callback);
    };

    // List nodes
    this.list = function(opts, callback) {
        Node.find({}, function(err, nodes) {
            callback(err, nodes);
        });
    };

    // Set node properties
    this.update_from_obj = function(model, obj) {
      model.set('children', obj.children);
      model.set('target_type', obj.target_type);
      model.set('target_id', obj.target_id);
    };

    // Create a node
    this.create = function(n, callback) {
      if (!n.target_type || n.target_type==='') {
        callback(new Error('missing required field: target_type'));
        return;
      }
      if (!n.target_id || n.target_id==='') {
        callback(new Error('missing required field: target_id'));
        return;
      }
      var node = new Node();
      self.update_from_obj(node, n);
      node.save(function(err){
        if (err) callback(err);
        else callback(undefined, node);
      });
    };

    // Update a node
    this.update = function(n, callback) {
      self.get(n._id, function(err, node) {
        if (err) callback(err);
        else if (node==null) callback(new Error('Node not found'));
        else {
          self.update_from_obj(node, n);
          node.save(callback);
        }
      });
    };

    // Destroy a node 
    this.destroy = function(id, callback) {
      self.get(id, function(err, node) {
        if (err) callback(err);
        else if (node==null) callback(new Error('Node not found'));
        else {
          node.remove(callback);
        }
      });
    };
}

module.exports = NodeAPI;

