var Some = Some || new Backbone.Marionette.Application();


Some.module("ContentTree", function(){

  this.selector = "#content_tree";
  var self = this;

  // converts an array of page objects to an array of jstree node data
  this.page_to_treenode = function(pages) {
    var a = [];
    for (var i=0; i<pages.length; i++) {
      var page = pages[i];
      a.push({
        data: page.title,
        attr: { nodeid: page._id },
        state: 'closed'
      });
    }
    return a;
  };

  // sets up the jstree for managing pages
  this.content_jstree = function() {
    var $selector = $(self.selector);
    $selector
      // navigate to edit
      .bind("select_node.jstree", function(event, data) {
        var node = $selector.jstree("get_selected");
        Some.Dashboard.Router.navigate("#/edit/"+node.attr('nodeid'),true);
      })
      // configure the tree control
      .jstree({
        core: {},
        plugins: [ "themes", "json_data", "ui" ],
        json_data: {
          ajax: {
            data: function(node) {
              var ret;
              if (node===-1) ret = {};
              else ret = { "parent": $(node).attr('nodeid') };
              return ret;
            },
            url: function(node) {
              return '/some/api/page/rest'
            },
            success: function(data) {
              var ret = Some.ContentTree.page_to_treenode(data);
              return ret;
            }
          }
        },
        themes: {
          theme: 'default'
        },
        ui: {
          select_limit: 1
        }
      });
  };

});

