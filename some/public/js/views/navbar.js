var app = app || {};

$(function( $ ) {
    'use strict';

	// Top Nav Bar 
	// -------------------

	app.NavbarView = Backbone.View.extend({

        el: '#navbar',

        initialize: function() {
          $.Mustache.load('/some/js/templates/global.html')
              .done(function () {
                  var viewData = {};
                  $('#navbar').mustache('navbar-template', viewData);
              });
        }

    });
    
});
