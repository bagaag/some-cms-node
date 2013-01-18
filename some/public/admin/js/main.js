var Some = Some || new Backbone.Marionette.Application();

// Configure custom template loading, compiling and rendering
Some.addInitializer(function(options) {
  // loading
  Some.TemplateLoader = new SomeTemplateLoader({dir:'templates/', selector:'>div'});
  Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(name) {
    var template = Some.TemplateLoader.get_template(name);
    return template;
  };
  // compiling
  Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
    var compiled = Mustache.compile(rawTemplate);
    return compiled;
  };
  // rendering
  Backbone.Marionette.Renderer.render = function(template, data) {
    var template = Marionette.TemplateCache.get(template);
    return template(data);
  }
});

// Initialize the app
Some.addInitializer(function(options) {
  Some.Dashboard.Controller.show();
  Backbone.history.start();
  Some.Dashboard.Router.navigate("dashboard",{trigger: true});
});

// Start the app
$(document).ready(function(){
  Some.start({});
});









