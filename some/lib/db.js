var config = require('../../config.js');
var mongoose = require('mongoose');
mongoose.connect(config.db.mongodb);
require('./models')({'mongoose': mongoose});
module.exports = mongoose;