var app = app || {};

(function() {
    'use strict';

	// Some Router
	// ----------

	var Workspace = Backbone.Router.extend({
		routes:{
			'/apidoc': 'apidoc'
		 ,'': 'dashboard'
     ,'/dashboard': 'dashboard'
		},

	});
  app.Router = new Workspace();
  app.Router.on('route:apidoc', function(){alert('1');});
  app.Router.on('route:dashboard', function(){alert('2');});
  Backbone.history.start();
}());
