var Some = Some || new Backbone.Marionette.Application();

Some.module("Nodes", function(){

  this.Model = Backbone.Model.extend({

    urlRoot: "/some/api/node/rest",
    idAttribute: "_id",

    defaults: {
      label: '',
      parent_id: null,
      target_id: '',
      target_type: '',
      order: 0
    }

  });

  this.Collection = Backbone.Collection.extend({
    url: "/some/api/node/rest",
    model: this.Model,

    children: function(ids, options) {
      options.data = $.param({'_id': ids});
    },
  
    root: function(options) {
      this.fetch();
    }
  });

});
