
module( "editing module" ,{
    setup: function() {
      container.append
        ('<div id="content"></div>');
        // must be re-inited because regions get invalidated after 1st use
        Some.Editor.Controller = new Some.Editor.ControllerClass();
    }, 
    teardown: function(){
    }
  }
);

asyncTest( "editPage", 1, function() {
  //Some.vent.on("editPage.rendered", function() {
    ok(false, 'write tests for editPage');
    start();
  //});
  Some.Editor.Controller.editPage();
});

