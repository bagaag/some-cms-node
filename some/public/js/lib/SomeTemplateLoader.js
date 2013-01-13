/* 
   Provides template file management and loading 
   =============================================
 
   Usage: 
     var templateLoader = new SomeTemplateLoader({
           'dir': '/path/to/templates/',
           'sep': '-',
           'ext': '.html'
     });
     // get the "home" template from the "home.html" template
     var home = templateLoader.get_template('home');
     // get the "home-sidebar1" template from the "home.html" template
     var sidebar1 = templateLoader.get_template('home-sidebar1');

   Where /path/to/templates/home.html contains:
     <script id="home">This is the home template.</script>
     <script id="home-sidebar1"> This is the home-sidebar1 template.</script>

   Note that files are cached, but not individual templates. This 
   file assumes template caching is externally provided (e.g. Marionette).

*/
function SomeTemplateLoader(params) {
  if (typeof params === 'undefined') params  = {};
  var TEMPLATE_DIR = params.dir||'';
  var TEMPLATE_EXT = params.ext||'.html';
  var SEP = params.sep||'-';

  var file_cache = {};

  function get_filename(name) {
    if (name.indexOf('-')>-1) name = name.substring(0,name.indexOf('-'));
    return TEMPLATE_DIR + name + TEMPLATE_EXT;
  }

  this.get_template = function(name) {
    var template;
    var file = get_filename(name);
    var file_content;
    var result;
    if (!(file_content = file_cache[name])) {
      $.ajax({
        url: file,
        async: false,
        success: function(data) {
          file_content = $('<div>'+data+'</div>'); // wrap top-level templates for selection
          file_cache[name] = file_content; 
        }
      });
    }
    return file_content.find('#'+name).html();
  }

  this.clear_cache = function() { 
    template_cache = {}; 
  };

};

