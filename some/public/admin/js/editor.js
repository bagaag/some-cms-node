var Some = Some || new Backbone.Marionette.Application();

Some.module("Editor", function(){

  this.EditorModel = Backbone.Model.extend({
  });

  // Define views
  var EditorView = Backbone.Marionette.ItemView.extend({
    template: "editor",
    onDomRefresh: function() {
      // http://www.tinymce.com/tryit/jquery_plugin.php
      //TODO: include CSS, configure buttons, etc.
      $("#page-body").tinymce({
        script_url : '/some/admin/js/lib/tiny_mce/tiny_mce.js',
        theme : 'advanced'
      });
    },
    close: function() {
    }
  });

  // Define controller class
  this.ControllerClass = Marionette.Controller.extend({

    // load a page up for editing and render the editor view
    editPage: function(id){
      Some.Dashboard.Controller.init();
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

