var app = app || {};

$(function( $ ) {
    'use strict';

	// The admin dashboard 
	// -------------------

	app.AppView = Backbone.View.extend({

        initialize: function() {
          $.Mustache.options.warnOnMissingTemplates = true;
	        app.NavbarView = new app.NavbarView();
        },

    });
    
});
