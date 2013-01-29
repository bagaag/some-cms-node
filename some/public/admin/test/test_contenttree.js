
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

test( "page_to_treenode", 1, function() {
  var start = [{'_id': '123', 'title': 'Title 1', 'body': 'Body 1'},
               {'_id': '456', 'title': 'Title 2', 'body': 'Body 2'}];
  var finit = [{'attr': { 'nodeid': '123'}, 'data': 'Title 1', 'state': 'closed'},
               {'attr': { 'nodeid': '456'}, 'data': 'Title 2', 'state': 'closed'}];
  var result = Some.ContentTree.page_to_treenode(start);
  deepEqual(finit, result, 'Result is as expected');
});

asyncTest( "content_tree", 1, function() {
  Some.vent.on("content_tree.loaded", function() {
    ok(true, 'loaded event triggered');
    start();
  });
  Some.ContentTree.content_jstree();
});

