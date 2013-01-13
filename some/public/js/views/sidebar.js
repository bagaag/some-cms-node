var app = app || {};

$(function( $ ) {
    'use strict';

	// Left Side Bar 
	// -------------------

	app.SidebarView = Backbone.View.extend({

        el: '#sidebar',

        initialize: function() {
          $.Mustache.load('/some/js/templates/sidebar.html')
              .done(function () {
                  var viewData = {};
                  $('#sidebar').mustache('sidebar-template', viewData);
              });
        }

    });
    
});
