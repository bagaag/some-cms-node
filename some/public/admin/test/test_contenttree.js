
module( "content tree module" ,{
    setup: function() {
      container.append
        ('<div id="sidebar"></div>');
        // must be re-inited because regions get invalidated after 1st use
        Some.Dashboard.Controller = new Some.Dashboard.ControllerClass();
    }, 
    teardown: function(){
    }
  }
);

test( "ContentTree.page_to_treenode", 1, function() {
  var start = [{'_id': '123', 'label': 'Title 1', 'target_id': 'abc', 'target_type': 'some_pages'},
               {'_id': '456', 'label': 'Title 2', 'target_id': 'def', 'target_type': 'some_pages'}];
  var finit = [{"data":"Title 1","attr":{"_id":"123","label":"Title 1","target_id":"abc","target_type":"some_pages"},
                    "state":"closed"},
               {"data":"Title 2","attr":{"_id":"456","label":"Title 2","target_id":"def","target_type":"some_pages"},
                    "state":"closed"}];
  var view = new Some.ContentTree.View();
  var result = view.node_to_treenode(start);
  deepEqual(finit, result, 'Result is as expected');
});

asyncTest( "content_tree", 1, function() {
  Some.vent.on("content_tree.loaded", function() {
    ok(true, 'loaded event triggered');
    start();
  });
  var view = new Some.ContentTree.View();
  view.draw_tree();
});

