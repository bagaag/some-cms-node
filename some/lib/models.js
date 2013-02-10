function models(params) {
  var mongoose = params.mongoose;	
	
  var	Schema = mongoose.Schema;


  var Page = new Schema({
      title : { type: String },
      body : { type: String }
  }, {"collection": "some_pages"});
  mongoose.model('Page', Page);


  var Node = new Schema({
      root: { type: Boolean },
      label: [ { type: String} ],
      children: [ { type: Schema.ObjectId } ],
      target_id: { type: Schema.ObjectId },
      target_type: { type: String }
  }, {"collection": "some_nodes"});
  mongoose.model('Node', Node);

};
module.exports = models;
