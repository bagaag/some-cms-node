var Some = Some || new Backbone.Marionette.Application();

Some.module("ContentTree", function(){

  // menu above the tree control
  this.View = Backbone.Marionette.ItemView.extend({
    template: "sidebar-content-tree",
    events: {
      'click #contenttree_menu_new_page': 'new_page'
    },
    templateHelpers: Some.i18n.templateHelpers([
      'contenttree_menu_new', 
      'contenttree_menu_page'
    ]),
    // called after rendering
    onDomRefresh: function() {
      this.draw_tree();
    },
    // converts an array of page objects to an array of jstree node data
    page_to_treenode: function(pages) {
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
    },
    // draw the tree (after render)
    draw_tree: function() {
      var self = this;
      var $selector = $("#content_tree_control");
      $selector
        // event on load
        .bind("loaded.jstree", function(event,data) {
          Some.vent.trigger('content_tree.loaded');
        })
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
                var ret = self.page_to_treenode(data);
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
    },
    new_page: function() { 
      alert('hey now'); 
      //return false;
    }
  });


});

