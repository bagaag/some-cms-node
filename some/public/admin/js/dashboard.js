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
      Some.sidebarRegion.show(new SidebarView()); 
      Some.Dashboard.Controller.content_jstree();
      return this;
    },

    // converts an array of page objects to an array of jstree node data
    page_to_treenode: function(pages) {
      var a = [];
      for (var i=0; i<pages.length; i++) {
        var page = pages[i];
        a.push({
          data: page.title,
          attr: { nodeid: page._id },
          state: 'closed'
        });
      }
      return a;
    },

    // sets up the jstree for managing pages
    content_jstree: function() {
      jQuery("#contentnav")
        .jstree({
          core: {},
          plugins: [ "themes", "json_data" ],
          json_data: {
            ajax: {
              data: function(node) {
                var ret;
                if (node===-1) ret = {};
                else ret = { "parent": $(node).attr('nodeid') };
                return ret;
              },
              url: function(node) {
                return '/some/api/page/rest'
              },
              success: function(data) {
                var ret = Some.Dashboard.Controller.page_to_treenode(data);
                return ret;
              }
            }
          }
        });
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

