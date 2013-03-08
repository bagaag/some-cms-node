
module.exports = function(app) {

  // Schema definition
  var Schema = app.mongoose.Schema;
  var PageSchema = new Schema({
      title : { type: String, required: true },
      body : { type: String, required: false }
  }, {"collection": "some_pages"});

  // Add node plugin
  PageSchema.plugin(app.some.model.Node.NodePlugin, {label: 'title'});

  // Add to app.some.model namespace
  app.some.model.PageSchema = PageSchema;
  app.some.model.Page = app.mongoose.model("Page", PageSchema);

  // Register remove func w/ Node model
  app.some.model.Node.register_target_remover('some_pages', function(id,callback) {
    app.some.model.Page.remove({"_id": id}, function(err) {
      if (err) callback(err);
      else callback();
    });
  });
};
