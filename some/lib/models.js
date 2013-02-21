
module.exports = function(app) {
  var models = [
    './model_page.js', 
    './model_node.js'
  ];
  app.some.model = {};
  var l = models.length;
  for (var i = 0; i < l; i++) {
    require(models[i])(app);
  }
};

