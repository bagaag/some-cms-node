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
    // converts an array of node objects to an array of jstree node data
    node_to_treenode: function(nodes) {
      var a = [];
      for (var i=0; i<nodes.length; i++) {
        var node = nodes[i];
        a.push({
          data: node.label,
          attr: node,
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
          Some.Dashboard.Router.navigate("#/edit/"+node.attr('target_id'),true);
        })
        // configure the tree control
        .jstree({
          core: {},
          plugins: [ "themes", "json_data", "ui" ],
          json_data: {
            ajax: {
              url: function(node) {
                return '/some/api/node/rest';
              },
              data: function(node) {
                var id = '';
                if (node!=-1) {
                 return { _id: node.attr('children').split(',')}; 
                }
              },
              success: function(data) {
                var ret = self.node_to_treenode(data);
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

