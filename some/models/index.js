// Populate models at app.some.model.NAME
module.exports = function(app) {
  var models = [
    './model_node.js',
    './model_page.js' 
  ];
  app.some.model = {};
  var l = models.length;
  for (var i = 0; i < l; i++) {
    require(models[i])(app);
  }
};

