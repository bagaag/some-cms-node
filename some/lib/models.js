function models(params) {
  var mongoose = params.mongoose;	
	
  var	Schema = mongoose.Schema;


  var Page = new Schema({
      title : { type: String },
      body : { type: String }
  }, {"collection": "some_pages"});
  mongoose.model('Page', Page);


  var Node = new Schema({
      children: [{ type: Schema.ObjectId, ref: 'some_nodes' }],
      target_type: { type: String },
      target_id: { type: Schema.ObjectId }
  }, {"collection": "some_nodes"});
  mongoose.model('Node', Node);


  module.exports = models;
};
module.exports = models;
