
/* Provides template file management, file caching and rendering **/
function MustacheWrapper(params) {
  /* Template file name convention: everthing before first "-" is file name.
  * - name is a template w/ id="name" in "name.html"
  * - name-another-template is a template w/ id="name-another-template" in "name.html"
  */
  if (typeof params === 'undefined') params  = {};
  var TEMPLATE_DIR = params.dir||'';
  var TEMPLATE_EXT = params.ext||'.html';
  var SEP = params.sep||'-';
  var TEMPLATE_SELECTOR = params.selector||">script";

  var template_cache = {};

  function get_filename(name) {
    if (name.indexOf('-')>-1) name = name.substring(0,name.indexOf('-'));
    return TEMPLATE_DIR + name + TEMPLATE_EXT;
  }

  function get_template(name, cb) {
    var template;
    if (template = template_cache[name]) {
      cb(template);
      return;
    }
    var file = get_filename(name);
    var file_content;
    $.get(file, function(data) {
      data = '<div>'+data+'</div>'; // wrap top-level templates for selection
      var templates = $(data).find(TEMPLATE_SELECTOR)
      $(templates).each(function(ix,item) {
        var i = $(item);
        template_cache[i.attr('id')] = i.html();
      })
      if (template = template_cache[name]) {
        cb(template);
        return;
      } 
      else throw 'Failed to locate template ' + name;
    });
  }

  this.clear_cache = function() { template_cache = {}; };

  this.render = function(name, data, target, cb) {
    get_template(name, function(template){
      var result = Mustache.render(template, data);
      if (target) $(target).html(result);
      if (typeof cb === 'function') cb(result);
    });
  }
};

