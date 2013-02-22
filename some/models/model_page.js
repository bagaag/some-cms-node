
module.exports = function(app) {

  // Schema definition
  var Schema = app.mongoose.Schema;
  var PageSchema = new Schema({
      title : { type: String, required: true },
      body : { type: String, required: true }
  }, {"collection": "some_pages"});

  // Add node plugin
  PageSchema.plugin(app.some.model.Node.NodePlugin, {label: 'title'});

  // Add to app.some.model namespace
  app.some.model.PageSchema = PageSchema;
  app.some.model.Page = app.mongoose.model("Page", PageSchema);
};
