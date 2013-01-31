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

Some.options = {
  "root" : "/some/admin/"
}

// Initialize the app
Some.addInitializer(function(options) {
  Backbone.history.start();
  jQuery.extend(Some.options, options);
});









