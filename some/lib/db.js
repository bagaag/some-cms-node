function DB(app) {
  var mongoose = require('mongoose');
  mongoose.connect(app.config.db.mongodb);
  app.mongoose = mongoose;
}
module.exports = DB;
