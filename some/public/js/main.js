var Some = new Backbone.Marionette.Application();

// Dashboard Controller
// ====================
Some.DashboardController = Marionette.Controller.extend({

  initialize: function(options){
    //this.stuff = options.stuff;
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


Some.DashboardRouterClass = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    'dashboard': 'dashboard',
    'apidoc': 'apidoc'
  },
}),


Some.addInitializer(function(options){
  Some.Renderer = new MustacheWrapper({selector:'>div', dir:'/some/templates/'});
  Some.Dashboard = new Some.DashboardController();
  Some.DashboardRouter = new Some.DashboardRouterClass({controller: Some.Dashboard});
  Backbone.history.start();
});

$(document).ready(function(){
  Some.start({});
});









