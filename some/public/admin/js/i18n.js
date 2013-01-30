var Some = Some || new Backbone.Marionette.Application();

Some.module("Pages", function(){
  this.dictionaries = {
    'en_us': {
      'editor_saved': "Saved!"
    }
  };
  $.i18n.setDictionary(this.dictionaries.en_us);
});
