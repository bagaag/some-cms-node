
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
      Some.start({"templates": "../templates/"});
    }, 
    teardown: function(){
    }
  }
);

asyncTest( "initial state", 4, function() {
  Some.on("start", function() {
    ok($("#navbar").html().length>0, "#navbar full");
    ok($("#sidebar").html().length>0, "#sidebar full");
    ok($("#footer").html().length>0, "#footer full");
    start();
  });
});

asyncTest( "dashboard content", 3, function() {
  ok($("#content").html().length==0, "should be empty");
  Some.vent.on("#dashboard.rendered", function() {
    ok($("#content").html().indexOf("Dashboard")>0, "content check");
    start();
  });
  Some.Dashboard.Controller.dashboard();
});

test( "#apidoc", 2, function() {
  Some.Dashboard.Controller.apidoc();
  ok($("#content").html().indexOf("AxPI")>0, "content check");
});

