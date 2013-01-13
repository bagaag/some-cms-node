var app = app || {};

$(function( $ ) {
    'use strict';

	// Dashboard content 
	// -------------------

	app.DashboardView = Backbone.View.extend({

    el: '#content',

    initialize: function() {
        var self = this;
        $.Mustache.load('/some/js/templates/dashboard.html')
          .done(function() {
            self.render();
          });
        $.Mustache.load('/some/js/templates/apidoc.html');
      },

    render: function(data) {
      var viewData = data || {
        'pages': [{'page':'page 1'},{'page':'page 2'},{'page':'page 3'},{'page':'page 4'}]
      };
      $(this.el).html($.Mustache.render('dashboard-template', viewData));
      return this;
    },

    api_docs: function() {
      $(this.el).html($.Mustache.render('apidocs-template', {}));
    }

  });
    
});
