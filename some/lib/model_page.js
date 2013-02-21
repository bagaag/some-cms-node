
module.exports = function(app) {

  var Schema = app.mongoose.Schema;
  var PageSchema = new Schema({
      title : { type: String },
      body : { type: String }
  }, {"collection": "some_pages"});

  // add node plugin
  PageSchema.plugin(app.some.model.Node.NodePlugin, {label: 'title'});

  app.some.model.PageSchema = PageSchema;
  app.some.model.Page = app.mongoose.model("Page", PageSchema);
};
