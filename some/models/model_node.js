 
module.exports = function(app) {

  var utils = app.some.utils;

  // Schema definition
  var Schema = app.mongoose.Schema;
  var ObjectId = app.mongoose.Types.ObjectId;
  //TODO: return validations after resolving special root node requirement
  var collections = ['some_pages'];
  var NodeSchema = new Schema({
      label: { type: String, required: true },
      target_id: { type: Schema.Types.ObjectId, required: true },
      target_type: { type: String, required: true, enum: collections  },
      parent_id: { type: Schema.Types.ObjectId },
      order: { type: Schema.Types.Mixed, required: true, default: 1 }

  }, {"collection": "some_nodes"});

  /*** STATIC METHODS ***/

  // target models register a self.remove(id, callback) function for use
  // in recursive deletions
  NodeSchema.statics.target_removers = {};
  NodeSchema.statics.register_target_remover = function(collection, remove_func) {
    NodeSchema.statics.target_removers[collection] = remove_func;
  }

  // Get children of specified node (or root) 
  NodeSchema.statics.children = function(opts, callback) {
    var Node = app.some.model.Node;
    var query = {};
    if (typeof opts == 'undefined') opts = {};
    if (opts.parent_id) {
      query.parent_id = new ObjectId(opts.parent_id);
    } else {
      query.parent_id = null;
    }
    Node.find(query).sort('order').exec(function(err, nodes) {
      callback(err, nodes);
    });
  }

  // Remove a node from the tree based _id
  NodeSchema.statics.remove_node = function(id, callback) {
    var Node = app.some.model.Node;
    Node.remove({"_id": id}, function(err) {
      callback();
    });
  }

  // Rename a node
  NodeSchema.statics.update_label = function(target_id, label, callback) {
    var query = {"target_id": target_id};
    var update = { $set: { "label": label } };
    app.some.model.Node.findOneAndUpdate(query, update, callback);
  }

  // Reorder child nodes
  NodeSchema.statics.reorder_children = function(parent_id, order, callback) {
    var Node = app.some.model.Node;
    var query = { "parent_id" : parent_id };
    Node.find(query).sort('order').exec(function(err, nodes) {
      var len = order.length;
      if (len!=nodes.length) callback(409, 'Length mismatch');
      else {
        var parallel = new utils.Parallel(len, callback);
        for (var i=0; i<len; i++) {
          var node = nodes[i];
          node.order = order[i];
          node.save(parallel.done);
        }
      }
    });
  }

  // Get Recursive deletion consequences
  NodeSchema.statics.deletions = function(target_id, callback) {
    var Node = app.some.model.Node;
    var query = { "target_id" : target_id };
    var count = 0;
    var ret = [];
    var done = function() {
      if (count==0) callback(ret);
    }
    var recurseChildren = function(node) {
      ret.push(node);
      var query = { "parent_id" : node._id };
      count++;
      Node.find(query, function(err, nodes) {
        if (err) callback(err);
        for (var i=0; i<nodes.length; i++) {
          var n = nodes[i];
          recurseChildren(n);
        }
        count--;
        done();
      });
    };

    Node.findOne(query, function(err, node) {
      if (err) callback(err);
      else if (node==null) callback(404);
      else recurseChildren(node);
    });
  }

  /*** PLUGIN ***/

  // NodePlugin implements updating of node when a given type is updated
  NodeSchema.statics.NodePlugin = function(schema, options) {
    var Node = app.some.model.Node;
    // remember newness
    schema.pre('save', function(next) {
      this._wasnew = this.isNew;
      next();
    });

    // update add new target or update title on save
    //TODO: with no callback, seems like the request may end before this completes 
    schema.post('save', function(obj) {
      if (this._wasnew) {
        if (typeof obj._parent_node_id==undefined) obj._parent_node_id=null;
        // get order value
        Node.count({ parent_id: obj._parent_node_id }, function(err, count) {
          if (err) throw err;
          // create node
          var node = new Node();
          node.target_type = obj.collection.name;
          node.target_id = obj._id;
          node.label = obj.get(options.label);
          node.order = count+1;
          if (obj._parent_node_id) {
            node.parent_id = new ObjectId(obj._parent_node_id);
          } else {
            node.parent_id = null;
          }
          node.save(function(err) {
            if (err) throw err;
          });
        });
      } else {
        Node.update_label(obj._id, obj.get(options.label));
      }
    });

    // remove corresponding node and all descendants from tree
    schema.pre('remove', function(next) {
      var id = this._id;
      Node.deletions(id, function(nodes) {
        // setup parallel tracker for two calls per node (1 for node and 1 for target)
        var parallel = new utils.Parallel(nodes.length*2, next);
        for (var i=0; i<nodes.length; i++) {
          var node = nodes[i];
          // don't delete the target that triggered this call
          if (node.target_id==id) {
            parallel.done();
          }
          else { 
            Node.target_removers[node.target_type](node.target_id, function(err) {
              parallel.done();
            });
          }
          Node.remove_node(node._id, function(err) {
            parallel.done();
          });
        }
      });
    });
  }
 
  // Add to app.some namespace and register w/ Mongoose
  app.some.model.NodeSchema = NodeSchema;
  app.some.model.Node = app.mongoose.model("Node", NodeSchema);

}
