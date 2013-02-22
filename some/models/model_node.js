
module.exports = function(app) {

  // Schema definition
  var Schema = app.mongoose.Schema;
  var node_collections = ['some_pages'];
  var NodeSchema = new Schema({
      root: { type: Boolean },
      label: { type: String, required: true },
      children: [ { type: Schema.ObjectId } ],
      target_id: { type: Schema.ObjectId, required: true },
      target_type: { type: String, required: true, enum: node_collections }
  }, {"collection": "some_nodes"});

  /*** STATIC METHODS ***/

  // Get children of specified node (or root) 
  NodeSchema.statics.children = function(opts, callback) {
    var Node = app.some.model.Node;
    var query = {};
    if (typeof opts == 'undefined') opts = {};
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
    if (opts.parent_id) {
      query._id = new app.mongoose.Types.ObjectId(opts.parent_id);
      Node.findById(query, handler);
    } else {
      query.root = true;
      Node.findOne(query, handler);
    }
  }
  // Create a relationship
  NodeSchema.statics.add_child = function(parent_id, child_id, callback) {
    var query = {"_id": parent_id}; 
    var update = { $push: { children: child_id}};
    app.some.model.Node.findOneAndUpdate(query, update, callback);
  }

  // Create a root relationship
  NodeSchema.statics.add_root = function(child_id, callback) {
    var query = {"root": true}; 
    var update = { $push: { children: child_id}};
    app.some.model.Node.findOneAndUpdate(query, update, callback);
  }

  // Remove a target from the tree 
  NodeSchema.statics.remove_target = function(target_id, callback) {
    var Node = app.some.model.Node;
    Node.remove({target_id: target_id});
    Node.update({children: target_id}, {$pull: {children: target_id}});
  }

  // Rename a node
  NodeSchema.statics.update_label = function(target_id, label, callback) {
    var query = {"target_id": target_id};
    var update = { $set: { "label": label } };
    app.some.model.Node.findOneAndUpdate(query, update, callback);
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
    schema.post('save', function(next) {
      if (this._wasnew) {
        // create node
        if (this._parent_node_id) {
          Node.add_child(this._parent_node_id, this._id, next);
        } else {
          Node.add_root(this._id, next);
        }
      } else {
        Node.update_label(this._id, this.get(options.label), next);
      }
    });
    // remove from tree
    schema.post('remove', function(next) {
      Node.remove_target(this._id, next);
    });
  }
 
  // Add to app.some namespace and register w/ Mongoose
  app.some.model.NodeSchema = NodeSchema;
  app.some.model.Node = app.mongoose.model("Node", NodeSchema);

};
