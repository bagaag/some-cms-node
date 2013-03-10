var Some = Some || new Backbone.Marionette.Application();

Some.module("ContentTree", function(){

  this.selector = "#content_tree_control";

  // menu above the tree control
  this.View = Backbone.Marionette.ItemView.extend({
    template: "sidebar-content-tree",
    events: {
      'click #contenttree_menu_new_page': 'new_page',
      'click #contenttree_menu_delete': 'remove_node'
    },
    templateHelpers: Some.i18n.templateHelpers([
      'contenttree_menu_new', 
      'contenttree_menu_page',
      'contenttree_menu_delete'
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
          attr: { 
            id: node._id,
            target_id: node.target_id,
            target_type: node.target_type
          },
          state: 'closed'
        });
      }
      return a;
    },
    // draw the tree (must be called after page render)
    draw_tree: function() {
      var self = this;
      var $selector = $(Some.ContentTree.selector);
      $selector
        // event on load
        .bind("loaded.jstree", function(event,data) {
          Some.vent.trigger('content_tree.loaded');
        })
        // navigate to edit
        .bind("select_node.jstree", function(event, data) {
          var node = $selector.jstree("get_selected");
          self.selected_node = node;
          Some.Dashboard.Router.navigate("#/edit/"+node.attr('target_id'),true);
        })
        .bind("move_node.jstree", function(event, data) {
          var source = data.rslt.o;
          var parant = data.inst._get_parent(source);
          // parant == -1 if dropped on root
          console.log(source);
          console.log(parant);
        })
        // configure the tree control
        .jstree({
          "core": {},
          "plugins": [ "themes", "json_data", "ui", "crrm", "dnd" ],
          "json_data": {
            "ajax": {
              "url": function(node) {
                return '/some/api/node/rest';
              },
              "data": function(node) {
                var id = '';
                if (node!=-1) {
                 return { parent_id: node.attr('id')}; 
                }
              },
              "success": function(data) {
                var ret = self.node_to_treenode(data);
                return ret;
              }
            }
          },
          "crrm": {
            "move": {
              "check_move": function(data) {
                return true;
              }
            }
          },
          "dnd": {
            "drag_target": false,
            "drop_target": false,
            "copy_modifier": false
          },
          "themes": {
            "theme": 'default'
          },
          "ui": {
            "select_limit": 1
          },
        }); 
    }, 
    new_page: function() { 
      var self = this;
      // default name for new pages is set in i18n
      var pdata = { title: $.i18n._('contenttree_new_page_title'), body: '' };
      if (typeof this.selected_node != 'undefined') {
        pdata._parent_node_id = this.selected_node.attr('id');
      }
      Some.ContentTree.Controller.new_page(pdata, this.error, function() {
        Some.ContentTree.Controller.refresh();
      });
    },
    remove_node: function() {
      var self = this;
      $(".confirm_modal").confirmModal({
        "heading" : $.i18n._('contenttree_remove_confirm_head'),
        "body" : $.i18n._('contenttree_remove_confirm_body'),
        "callback" : function() {
          if (typeof self.selected_node != 'undefined') {
            Some.ContentTree.Controller.delete_node(
                self.selected_node.attr('target_id'),
                self.selected_node.attr('target_type'),
                function(msg) { self.error(msg); },
                function() { 
                  Some.ContentTree.Controller.refresh();
                }
              );
          }
        }
      });
    },
    error: function(s) {
      alert(s);
    }
  });

  // Define controller class
  this.ControllerClass = Marionette.Controller.extend({
    // add a new page
    new_page: function(data, error, success) {
      var page = new Some.Pages.Model(data);
      var valid = page.save(null, {
        'error': function(model, xhr, options){ 
          // why is error called when status is 201??
          if (xhr.status==201) success();
          else error(xhr.status + ': ' + xhr.responseText);
        },
        'success': function() { 
          success();
        }
      });
      if (!valid) error('Unexpected invalid result');
    },

    refresh: function(id) {
      if (!id) id=-1;
      $(Some.ContentTree.selector).jstree("refresh", id);
    },

    delete_node: function(id, type, error, callback) { 
      if (type=='some_pages') {
        var page = new Some.Pages.Model({_id: id});
        page.destroy({
          'error' : error,
          'success' : callback
        });
      } else {
        error('Type ' + type + ' is unhandled');
      }
    }

  });

  Some.addInitializer(function(options) {
    Some.ContentTree.Controller = new Some.ContentTree.ControllerClass();
  });
});

