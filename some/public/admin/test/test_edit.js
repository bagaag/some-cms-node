
// expect +1
module( "editing module" ,{
    setup: function() {
      container.append
        ('<div id="sidebar"></div>'+
        '<div id="content"></div>');
        // must be re-inited because regions get invalidated after 1st use
        Some.Editor.Controller = new Some.Editor.ControllerClass();
    }, 
    teardown: function(){
    }
  }
);

asyncTest( "contentTree", 3, function() {
  Some.vend.on("contentTree.rendered", function() {
    ok($("#contentTree .pageNode").length>0, "has pageNodes");
    ok($("#contentTree .pageNode:eq(0)").text().length>0, "first node has label");
    start();
  });
  Some.Editor.Controller.contentTree();
});

asyncTest( "editPage", 3, function() {
  Some.vent.on("editPage.rendered", function() {
    ok(false, 'write tests for editPage');
    start();
  });
  Some.Editor.Controller.editPage();
});

