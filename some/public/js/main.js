var Some = Some || new Backbone.Marionette.Application();

Some.addInitializer(function(options){
  Some.Renderer = new MustacheWrapper({selector:'>div', dir:'/some/templates/'});
  Some.Dashboard.Controller.show();
  Backbone.history.start();
});

$(document).ready(function(){
  Some.start({});
});









