var Some = Some || new Backbone.Marionette.Application();

Some.module("Pages", function(){

  this.Model = Backbone.Model.extend({

    urlRoot: "/some/api/page/rest",
    idAttribute: "_id",

    defaults: {
      title: '',
      body: '',
      'parent': undefined
    }

  });

  this.Collection = Backbone.Collection.extend({
    url: "/some/api/page/rest",
    model: this.Model
  });

});
