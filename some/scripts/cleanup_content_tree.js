// remove nodes whose targets don't exist
var nodes = db.some_nodes.find();
var remove_nodes = [];
var node_count = 0;
var node_ids = [];
nodes.forEach(function(node) {
  if (node.target_type=='some_pages') {
    var exists = db.some_pages.find({_id: node.target_id},{_id:true}).length()>0;
    if (!exists) {
      remove_nodes.push(node._id);
      print("removed node " + node._id + " | " + (node.label||"ROOT"));
    } else {
      node_ids.push(node._id);
    }
  }
  node_count++;
});
db.some_nodes.remove({_id: {$in: remove_nodes}});

// remove node children whose targets don't exist
var child_count = 0;
nodes = db.some_nodes.find();
nodes.forEach(function(node) {
  var c = node.children;
  if (!c) return;
  for (var i=0; i<c.length; i++) {
    var cid = c[i];
    var exists = db.some_nodes.find({_id: cid}, {_id:true}).length()>0;
    if (!exists) {
      db.some_nodes.update({_id: node._id}, {$pull: {children: cid}});
      print("remove child " + cid + " from " + node._id + " | " + (node.label||"ROOT"));
    }
    child_count++;
  }
});
print("processed " + node_count + " nodes and " + child_count + " children");

// remove orphans nodes
var root = db.some_nodes.findOne({root:true});
function check_orphans(children) {
  for (var i=0; i<children.length; i++) {
    var id = children[i];
    node_ids.splice(node_ids.indexOf(id), 1);
    var n = db.some_nodes.findOne({_id: id});
    if (n.children) {
      check_orphans(n.children);
    }
  }
}
check_orphans(root.children);
print("found " + node_ids.length + " orphans");
db.some_nodes.remove({_id: {$in : node_ids}});

