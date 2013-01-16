function models(params) {
  var mongoose = params.mongoose;	
	
  var	Schema = mongoose.Schema;
   
	/* Schema Definition */	
  var Page = new Schema({
      title : { type: String }
    , body : { type: String }
  }, {"collection": "some_pages"});
    
  mongoose.model('Page', Page);
  module.exports = models;
};
module.exports = models;
