var Some = Some || new Backbone.Marionette.Application();

Some.module("Editor", function(){

  this.EditorModel = Backbone.Model.extend({
  });

  // Define views
  var EditorView = Backbone.Marionette.ItemView.extend({
    template: "editor"
  });

  // Define controller class
  this.ControllerClass = Marionette.Controller.extend({

    // load a page up for editing and render the editor view
    editPage: function(id){
      var page = new Some.Pages.Model({"_id": id});
      page.fetch({'success': function(pmod, res, opt) {
        var model = new Some.Editor.EditorModel({"page": pmod.toJSON()});
        Some.contentRegion.show(new EditorView({"model": model})); 
      }});
      return this;
    }
    
  });

  this.RouterClass = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      'edit': 'editPage',
      'edit/:id': 'editPage'
    }
  });

  Some.addInitializer(function(options) {
    Some.Editor.Controller = new Some.Editor.ControllerClass();
    Some.Editor.Router = new Some.Editor.RouterClass({controller: Some.Editor.Controller});
  });
});

