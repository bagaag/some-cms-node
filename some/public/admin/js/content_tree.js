var Some = Some || new Backbone.Marionette.Application();

Some.module("ContentTree", function(){

  this.selector = "#content_tree_control";
  var self = this;

  // menu above the tree control
  this.MenuView = Backbone.Marionette.ItemView.extend({
    template: "content_tree_menu",
    events: {
      'click #new_page_btn': 'new_page'
    },
    templateHelpers: Some.i18n.templateHelpers([
      'one', 'two'
    ]),
    new_page: function() { alert('hey now'); }
  });


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

  //TODO: Convert this into a .render method on a TreeControl view
  // sets up the jstree for managing pages
  this.content_jstree = function() {
    var $selector = $(self.selector);
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

