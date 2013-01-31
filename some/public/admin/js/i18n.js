var Some = Some || new Backbone.Marionette.Application();

Some.module("i18n", function(){

  //TODO: farm out to resource files
  this.dictionaries = {
    'en_us': {
      'contenttree_menu_new': 'New',
      'contenttree_menu_page': 'Page',
      'editor_saved': "Success!",
      'editor_lbl_save': 'Save',
      'editor_err_head': "Ruh-roh.",
      'editor_head' : "Editing Document %1$s"
    }
  };
  $.i18n.setDictionary(this.dictionaries.en_us);

  // generate template helper functions for a view
  this.templateHelpers = function(names) {
    var helpers = {};
    for (var i=0; i<names.length; i++) {
      var n = names[i];
      // names can contain strings or functions, for handling parameterized messages
      if (typeof n === 'string') {
        // assign the message to the message key
        helpers[n] = $.i18n._(n);
      }
      else if (typeof n === 'function') {
        // assign the custom function to the message key, given in the function's name
        helpers[n.name] = n;
      }
    }
    return helpers;
  }
});
