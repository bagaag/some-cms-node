var Some = Some || new Backbone.Marionette.Application();

Some.module("Pages", function(){

  this.Model = Backbone.Model.extend({

    initialize: function() {
    },
    
    idAttribute: "_id",

    defaults: {
      title: '',
      body: ''
    },

    exists: function() {
      return typeof this.get('_id')!='undefined' && this.get('_id').length>0;
    }
  });

  this.Collection = Backbone.Collection.extend({
    url: "/some/api/page/rest",
    model: this.Model
  });

});
