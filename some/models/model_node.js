 
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

  // Remove a target from the tree 
  NodeSchema.statics.remove_target = function(target_id, callback) {
    var Node = app.some.model.Node;
    Node.remove({"target_id": target_id}, function(err, node) {
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
    // remove from tree
    schema.pre('remove', function(next) {
      Node.remove_target(this._id, next);
    });
  }
 
  // Add to app.some namespace and register w/ Mongoose
  app.some.model.NodeSchema = NodeSchema;
  app.some.model.Node = app.mongoose.model("Node", NodeSchema);

};
