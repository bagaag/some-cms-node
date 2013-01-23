var Some = Some || new Backbone.Marionette.Application();

Some.module("Editor", function(){

  // Define views
  var EditorView = Backbone.Marionette.ItemView.extend({
    template: "editor"
  });

  // Define controller class
  this.ControllerClass = Marionette.Controller.extend({

    initialize: function(options){
    },

    editPage: function(){
      return this;
    }
    
  });

  this.RouterClass = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      '/edit/[id]': 'editPage'
    },
  });

  Some.addInitializer(function(options) {
    Some.Editor.Controller = new Some.Editor.ControllerClass();
    Some.Editor.Router = new Some.Editor.RouterClass({controller: Some.Editor.Controller});
  });
});

