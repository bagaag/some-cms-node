var Some = Some || new Backbone.Marionette.Application();

// Configure custom template loading, compiling and rendering
Some.addInitializer(function(options) {
  // loading
  Some.TemplateLoader = new SomeTemplateLoader({dir: options.templates, selector: '>div'});
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
  Backbone.history.start();
  if (options.navigate) {
    Some.Dashboard.Controller.navbar().sidebar().footer();
    Some.Dashboard.Router.navigate(options.navigate, {trigger: true});
  }
});









