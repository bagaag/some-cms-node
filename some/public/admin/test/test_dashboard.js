QUnit.config.reorder = false;

Some.start({"templates": "../templates/"});
var container = $( "#qunit-fixture" );

// expect +1
module( "dashboard module" ,{
    setup: function() {
      ok($("#content").length==0, "#content shouldn't exist");
      container.append
        ('<div id="navbar"></div>'+
        '<div id="sidebar"></div>'+
        '<div id="content"></div>'+
        '<div id="footer"></div>');
        // must be re-inited because regions get invalidated after 1st use
        Some.Dashboard.Controller = new Some.Dashboard.ControllerClass();
    }, 
    teardown: function(){
    }
  }
);

test( "navbar", 2, function() {
  Some.Dashboard.Controller.navbar();
  ok($("#navbar").html().length>0, "#navbar full");
})

test( "apidoc", 2, function() {
  Some.Dashboard.Controller.apidoc();
  ok($("#content").html().indexOf("API Documentation")>0, "apidoc rendered");
})

test( "sidebar", 2, function() {
  Some.Dashboard.Controller.sidebar();
  ok($("#sidebar").html().length>0, "#sidebar full");
})

test( "footer", 2, function() {
  Some.Dashboard.Controller.footer();
  ok($("#footer").html().length>0, "#footer full");
})

asyncTest( "dashboard", 3, function() {
  Some.vent.on("#dashboard.rendered", function() {
    ok($("#content").html().indexOf("Dashboard")>0, "dashboard rendered");
    // test reuse with same controller and no tear-down
    Some.Dashboard.Controller.apidoc();
    ok($("#content").html().indexOf("API Documentation")>0, "controller/region reuse");
    start();
  });
  Some.Dashboard.Controller.dashboard();
});

