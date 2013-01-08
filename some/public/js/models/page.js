var app = app || {};

(function() {
    'use strict';

	// Page Model
	// ----------

	app.Todo = Backbone.Model.extend({

		defaults: {
			title: '',
			body: false
		},

		// Example method
		make_important: function() {
			this.save({
				title: this.get('title')+"!!"
			});
		}

	});

}());