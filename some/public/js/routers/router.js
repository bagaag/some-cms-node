var app = app || {};

(function() {
    'use strict';

	// Some Router
	// ----------

	var Workspace = Backbone.Router.extend({
		routes:{
			'pages.html': 'testRoute'
		},

		testRoute: function() {
            $("#pages").append("<p>Hey now.</p>");
			//app.Pages.trigger('list');
		}
	});

	app.SomeRouter = new Workspace();
	Backbone.history.start();

}());