var Some = Some || new Backbone.Marionette.Application();

Some.module("Dashboard", function(){
  this.ControllerClass = Marionette.Controller.extend({

    initialize: function(options){
      //this.stuff = options.stuff;
    },

    show: function() {
      Some.Renderer.render('sidebar', {}, '#sidebar');
      Some.Renderer.render('navbar', {}, '#navbar');
      Some.Renderer.render('dashboard', {}, '#content');
    },

    apidoc: function(){
      //this.trigger("dashboard:changed", this.stuff);
      Some.Renderer.render('apidoc', {}, '#content');
    },

    dashboard: function(){
      //this.trigger("dashboard:changed", this.stuff);
      Some.Renderer.render('dashboard', {}, '#content');
    }

  });

  this.RouterClass = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'dashboard': 'dashboard',
      'apidoc': 'apidoc'
    },
  });

  Some.addInitializer(function(options) {
    Some.Dashboard.Controller = new Some.Dashboard.ControllerClass();
    Some.Dashboard.Router = new Some.Dashboard.RouterClass({controller: Some.Dashboard.Controller});
  });
});

