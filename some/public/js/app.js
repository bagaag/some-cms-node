var app = app || {};
// constants go here

$(function() {

  $.Mustache.options.warnOnMissingTemplates = true;

  app.NavbarView = new app.NavbarView();
	app.SidebarView = new app.SidebarView();
	app.DashboardView = new app.DashboardView();

});
