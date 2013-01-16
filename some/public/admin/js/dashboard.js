var Some = Some || new Backbone.Marionette.Application();

Some.module("Dashboard", function(){

  // Define views
  var FooterView = Backbone.Marionette.ItemView.extend({
    template: "footer"
  });
  var NavbarView = Backbone.Marionette.ItemView.extend({
    template: "navbar"
  });
  var SidebarView = Backbone.Marionette.ItemView.extend({
    template: "sidebar"
  });
  var DashboardView = Backbone.Marionette.ItemView.extend({
    template: "dashboard"
  });
  var ApiDocView = Backbone.Marionette.ItemView.extend({
    template: "apidoc"
  });


  this.ControllerClass = Marionette.Controller.extend({

    initialize: function(options){
      // instantiate views
      this.views = {
        'navbar': new NavbarView(),
        'sidebar': new SidebarView(),
        'dashboard': new DashboardView(),
        'apidoc': new ApiDocView(),
        'footer': new FooterView()
      };
      // define regions
      Some.addRegions({
        footerRegion: '#footer',
        sidebarRegion: '#sidebar',
        navbarRegion: '#navbar',
        contentRegion: '#content'
      });
    },

    show: function() {
      Some.navbarRegion.show(this.views.navbar); 
      Some.sidebarRegion.show(this.views.sidebar); 
      Some.footerRegion.show(this.views.footer); 
      Some.contentRegion.show(this.views.dashboard); 
    },

    apidoc: function(){
      Some.contentRegion.show(this.views.apidoc); 
    },

    dashboard: function(){
      Some.contentRegion.show(this.views.dashboard); 
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

