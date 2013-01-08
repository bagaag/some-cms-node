var app = app || {};

(function() {
    'use strict';

	// Page Collection
	// ---------------

	var Pages = Backbone.Collection.extend({

		// Reference to this collection's model.
		model: app.Page,

	});

	// Create our global collection of **Todos**.
	app.Pages = new Pages();

}());