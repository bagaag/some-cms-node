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
  var ApiDocView = Backbone.Marionette.ItemView.extend({
    template: "apidoc"
  });
  var DashboardView = Backbone.Marionette.ItemView.extend({
    template: "dashboard"
  });

  this.SidebarModel = Backbone.Model.extend({
  });

  // Define controller class
  this.ControllerClass = Marionette.Controller.extend({

    initialize: function(options){
      // define regions
      Some.addRegions({
        footerRegion: '#footer',
        sidebarRegion: '#sidebar',
        navbarRegion: '#navbar',
        contentRegion: '#content'
      });
    },

    sidebar: function() {
      var model = new Some.Dashboard.SidebarModel();
      var c = new Some.Pages.Collection();
      c.fetch({'success': function(col, res, opt) {
        model.set('contentTreePages', col.toJSON());
        var view = new SidebarView({model: model});
        Some.sidebarRegion.show(view); 
        Some.vent.trigger("sidebar.rendered");
      }});
      return this;
    },

    footer: function() {
      Some.footerRegion.show(new FooterView()); 
      return this;
    },

    navbar: function() {
      Some.navbarRegion.show(new NavbarView()); 
      return this;
    },
    
    apidoc: function(){
      Some.contentRegion.show(new ApiDocView()); 
      return this;
    },

    dashboard: function(){
      var c = new Some.Pages.Collection();
      c.fetch({'success': function(col, res, opt) {
        var view = new DashboardView({collection: col});
        Some.contentRegion.show(view); 
        Some.vent.trigger("#dashboard.rendered");
      }});
      return this;
    }
    
  });

  this.RouterClass = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'dashboard': 'dashboard',
      '/dashboard': 'dashboard',
      'apidoc': 'apidoc',
      '/apidoc': 'apidoc'
    },
  });

  Some.addInitializer(function(options) {
    Some.Dashboard.Controller = new Some.Dashboard.ControllerClass();
    Some.Dashboard.Router = new Some.Dashboard.RouterClass({controller: Some.Dashboard.Controller});
  });
});

