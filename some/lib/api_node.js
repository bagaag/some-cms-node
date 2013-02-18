function NodeAPI(params) {

    var self = this;
    var db = params.db;
    var Node = db.model('Node');

    // Fetch node by ID
    this.get = function(id, callback) {
      Node.findById(id, callback);
    };

    // List nodes - returns root nodes or children of specified parent_id
    this.list = function(opts, callback) {
      var query = {};
      var handler = function(err, pnode) {
        var children = pnode.children;
        query = { _id : { $in : children } };
        Node.find(query, function(err, nodes) {
          // put the children into the correct order
          for (var i=0; i<nodes.length; i++) {
            var id = nodes[i]._id;
            var ix = children.indexOf(id);
            nodes[i].ix = ix;
          }
          nodes.sort(function(a,b) { return a>b; });
          callback(err, nodes);
        });
      }
      if (opts && opts.parent_id) {
        query._id = new db.Types.ObjectId(opts.parent_id);
        Node.findById(query, handler);
      } else {
        query.root = true;
        Node.findOne(query, handler);
      }
    };

      var getParent = Node.findById;
    // Set node properties
    this.update_from_obj = function(model, obj) {
      model.set('label', obj.label);
      model.set('children', obj.children);
      model.set('target_type', obj.target_type);
      model.set('target_id', obj.target_id);
    };

    // Create a node
    this.create = function(n, callback) {
      if (!n.target_type || n.target_type==='') {
        callback(new Error('Missing required field: target_type'));
        return;
      }
      if (!n.target_id || n.target_id==='') {
        callback(new Error('Missing required field: target_id'));
        return;
      }
      if (!n.label || n.label==='') {
        callback(new Error('Missing required field: label'));
        return;
      }
      var node = new Node();
      self.update_from_obj(node, n);
      node.save(function(err){
        if (err) callback(err);
        else {
          // if a parent is specified, add the new node as a child
          if (n.parent_id) {
            self.add_child(n.parent_id, node.get('_id'), function(err) {
              if (err) {
                // parent doesn't exist, undo the create
                node.remove();
                callback(new Error('Failed to create child relationship: ' + err.message));
              } else {
                callback(undefined, node);
              }
            });
          }
          // otherwise add to the root
          else {
            self.add_root(node.get('_id'), function(err) {
              if (err) {
                // parent doesn't exist, undo the create
                node.remove();
                callback(new Error('Failed to create root relationship: ' + err.message));
              } else {
                callback(undefined, node);
              }
            });
          }
        }
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
      // remove any child references
      var query = { children: id }; 
      var update = { $pull: { children: id } };
      Node.update(query, update, function(err) {
        if (err) callback(err);
        else {
          // remove the node
          query = { _id: id };
          Node.remove(query, function(err) {
            callback(err);
          });
        }
      });
    };

    // Create a relationship
    this.add_child = function(parent_id, child_id, callback) {
      var query = {"_id": parent_id}; 
      var update = { $push: { children: child_id}};
      Node.findOneAndUpdate(query, update, callback);
    };

    // Create a root relationship
    this.add_root = function(child_id, callback) {
      var query = {"root": true}; 
      var update = { $push: { children: child_id}};
      Node.findOneAndUpdate(query, update, callback);
    };

    // Rename a node
    this.update_label = function(target_id, label, callback) {
      var query = {"target_id": target_id};
      var update = { $set: { "label": label } };
      Node.findOneAndUpdate(query, update, callback);
    };
}

module.exports = NodeAPI;

