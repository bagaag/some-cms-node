var Some = Some || new Backbone.Marionette.Application();

Some.module("Editor", function(){

  this.EditorModel = Backbone.Model.extend({
  });

  // Define views
  var EditorView = Backbone.Marionette.ItemView.extend({
    template: "editor",
    initialize: function() {
    },
    onDomRefresh: function() {
      // http://www.tinymce.com/tryit/jquery_plugin.php
      //TODO: include CSS, configure buttons, etc.
      $("#page-body").tinymce({
        script_url : '/some/admin/js/lib/tiny_mce/tiny_mce.js',
        plugins : 'inlinepopups,table,advimage,advlink,media,searchreplace,paste,fullscreen',
        theme : 'advanced',
        theme_advanced_statusbar_location : 'none',
        content_css : '/some/admin/css/styles.css'
      });
    },
    events: { 
      "click #page-content-submit": "page_content_submit",
      "submit #page-content-form": "do_nothing"
    },
    error: function(s) {
      $("#page-content-error span").text(s);
      $("#page-content-error").show();
    },
    page_content_submit: function(args) {
      var p = this.model.get('page');
      var frm = $("#page-content-form")[0];
      p.title = frm.title.value;
      p.body = $("#page-body").html();
      Some.Editor.Controller.savePage(this);
      return false;
    },
    saved: function() {
      $("#page-content-saved")._t('editor_saved').show().fadeOut(4000);
    },
    do_nothing: function() { return false; }
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
    },

    // saves the page being edited
    savePage: function(view) {
      var model = view.model.get('page');
      var page = new Some.Pages.Model({"_id": model._id});
      page.fetch({'success': function(page, res, opt) {
        page.save(model, {
          'error': function(model, xhr, options){ 
            view.error(xhr.responseText);
          },
          'success': function() { view.saved(); }
        });
      }, 
      'error': function(model, xhr, options) {
          view.error(xhr.responseText);
      }});
      return false;
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

