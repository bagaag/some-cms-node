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


  // Define controller class
  this.ControllerClass = Marionette.Controller.extend({

    initialize: function(options){
      // define regions
      Some.addRegions({
        footerRegion: '#footer',
        sidebarRegion: '#sidebar',
        navbarRegion: '#navbar',
        contentRegion: '#content',
        contentTreeMenuRegion: '#content_tree_menu'
      });
      this.footerView = new FooterView();
      this.sidebarView = new SidebarView();
      this.navbarView = new NavbarView();
      this.contentTreeMenuView = new Some.ContentTree.MenuView();
    },
    
    sidebar: function() {
      Some.sidebarRegion.show(this.sidebarView); 
      //TODO: refactor, too much content tree detail for the dashboard module
      Some.ContentTree.content_jstree();
      Some.contentTreeMenuRegion.show(this.contentTreeMenuView);
      this.sidebarView.shown = true;
      return this;
    },

    footer: function() {
      Some.footerRegion.show(this.footerView); 
      this.footerView.shown = true;
      return this;
    },

    navbar: function() {
      Some.navbarRegion.show(this.navbarView); 
      this.navbarView.shown = true;
      return this;
    },
    
    apidoc: function(){
      Some.contentRegion.show(new ApiDocView()); 
      return this;
    },

    init: function() {
      if (!this.navbarView.shown) this.navbar();
      if (!this.sidebarView.shown) this.sidebar();
      if (!this.footerView.shown) this.footer();
    },

    dashboard: function(){
      this.init();
      // load the dashboard
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
      '': 'dashboard',
      'dashboard': 'dashboard',
      'apidoc': 'apidoc'
    },
  });

  Some.addInitializer(function(options) {
    Some.Dashboard.Controller = new Some.Dashboard.ControllerClass();
    Some.Dashboard.Router = new Some.Dashboard.RouterClass({controller: Some.Dashboard.Controller});
  });
});

