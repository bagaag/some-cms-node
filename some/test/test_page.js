var assert = require("assert");
var should = require("should");
var cfg = require("./config.js");
var scopedClient = require("scoped-http-client");
var client = scopedClient.create(cfg.http.hostname)
              .port(cfg.http.port)
              .header('accept', 'application/json')
              .header('Content-Type','application/json');
var results = {}; // stored results for comparison between API and web service

var page1 = { title: 'Test Page 1', body: '<p>Hello world.</p>'};
var page2 = { title: 'Test Page 2', body: '<p>Hello world.</p>'};
var page3 = { title: 'Test Page 3', body: '<p>Hello world.</p>'};

function get_url_id(s) {
  var sp = s.split('/');
  return sp[sp.length-1];
}

suite('Page API:', function() {

  // 1. create page at root
  test('Create and Get One', function(done) {
    client.path('/some/api/page/rest');
    client.post(JSON.stringify(page1))(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==201, 'Status 201');
      should.exist(resp.headers['location'],'should return Location header');
      results.page1_location = resp.headers['location'];
      results.page1_id = get_url_id(results.page1_location);
      done();
    });
  });

  // 2. get created page
  test('Get created page', function(done) {
    client.path('/some/api/page/rest/'+results.page1_id);
    client.get()(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==200, 'Status 200, got ' + resp.statusCode);
      var data = JSON.parse(body);
      should.exist(data._id, 'result has ._id');
      should.exist(data.title, 'result has .title');
      should.exist(data.body, 'result has .body');
      assert.ok(data.title==page1.title, 'title matches');
      assert.ok(data.body==page1.body, 'body matches');
      results.page1 = data;
      done();
    });
  });
  
  // 2b. confirm page is found at root
  test('GET /some/api/node/rest', function(done) {
    client.path('/some/api/node/rest');
    client.get()(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==200, 'Status 200');
      var data = JSON.parse(body);
      results.root_nodes = data;
      var l = data.length;
      var found = false;
      for (var i=0; i<l; i++) {
        var node = data[i];
        if (node.target_id == results.page1._id) {
          found = true;
          results.page1_node = node;
          results.page1_node_ix = i;
          break;
        }
      }
      assert.ok(found, 'page found in root nodes');
      done();
    });
  });

  // 3. list pages and confirm created page is among those listed
  test('GET /some/api/page/rest', function(done) {
    client.path('/some/api/page/rest');
    client.get()(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==200, 'Status 200');
      var data = JSON.parse(body);
      var l = data.length;
      var found = false;
      for (var i=0; i<l; i++) {
        var page = data[i];
        if (page._id == results.page1._id) {
          found = true;
          break;
        }
      }
      assert.ok(found, 'page found in list of pages');
      done();
    });
  });

  // 4. create sub-pages
  test('POST /some/api/page/rest (subpages)', function(done) {
    client.path('/some/api/page/rest');
    // create subpage 2
    page2._parent_node_id = results.page1_node._id;
    client.post(JSON.stringify(page2))(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==201, 'Status 201 page2');
      should.exist(resp.headers['location'],'should return Location header');
      results.page2_location = resp.headers['location'];
      results.page2_id = get_url_id(results.page2_location);

      // create subpage 3
      page3._parent_node_id = results.page1_node._id;
      client.post(JSON.stringify(page3))(function(err, resp, body) {
        if (err) throw err;
        assert.ok(resp.statusCode==201, 'Status 201 page3');
        should.exist(resp.headers['location'],'should return Location header');
        results.page3_location = resp.headers['location'];
        results.page3_id = get_url_id(results.page3_location);

        // get subpages
        client.path('/some/api/node/rest');
        client.query({'parent_id': results.page1_node._id});
        client.get()(function(err, resp, body) {
          if (err) throw err;
          client.query({'parent_id':undefined});
          assert.ok(resp.statusCode==200, 'Status 200 getting subnodes');
          var data = JSON.parse(body);
          
          // test for page2 node
          var node2 = data[0];
          should.exist(node2, 'first subnode exists');

          assert.ok(node2.label == page2.title 
              && results.page2_id == node2.target_id, 
              'first subnode properties match');
          results.page2_node = node2;

          // test for page3 node
          var node3 = data[1];
          should.exist(node3, 'second subnode exists');
          assert.ok(node3.label == page3.title 
              && results.page3_id == node3.target_id, 
              'second subnode properties match');
          results.page3_node = node3;
          done();
        })
      });
    });
  });

  // 5. rename page
  test('PUT /some/api/page/rest/ID', function(done) {
    var orig_title = results.page1.title;
    results.page1.title += ' Modified';
    // update the page w/ new name
    client.path('/some/api/page/rest/'+results.page1._id);
    client.put(JSON.stringify(results.page1))(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==204, 'PUT Status 204 after rename');

      // get the updated page
      client.get()(function(err, resp, body) {
        if (err) throw err;
        assert.ok(resp.statusCode==200, 'GET Status 200 after rename');
        var data = JSON.parse(body);
        assert.ok(data.title == results.page1.title, 'new name persisted in page');

        // get the updated root nodes
        client.query({});
        client.path('/some/api/node/rest');
        client.get()(function(err, resp, body) {
          if (err) throw err;
          assert.ok(resp.statusCode==200, 'Status 200');
          var data = JSON.parse(body);
          var node = data[results.page1_node_ix];
          should.exist(node, 'a node exists at expected index');
          assert.ok(node._id == results.page1_node._id, 'root node found at correct index');
          assert.ok(node.label == page1.title, 'node label updated');
          done();
        });
      });
    });
  });

  // 6. reorder subpages in tree
  test('PUT /some/api/node/rest/ID', function(done) {
    results.page1.children = [results.page3_node._id, results.page2_node._id];
    
    // put the node w/ reordered children
    client.path('/some/api/node/rest/'+results.page1_node._id);
    client.put(JSON.stringify(results.page1))(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==204, 'Status 204 after node update');
      
      // get the children to confirm 
      client.path('/some/api/node/rest');
      client.query({'parent_id': results.page1_node._id});
      client.get()(function(err, resp, body) {
        client.query({});
        if (err) throw err;
        assert.ok(resp.statusCode==200, 'Status 200 getting subnodes');
        var data = JSON.parse(body);
        
        // test for page3 node
        var node3 = data[0];
        should.exist(node3, 'first subnode exists');
        assert.ok(node3.label==page3.title 
            && results.page3_id == node3._id, 
            'first subnode properties match');

        // test for page2 node
        var node2 = data[1];
        should.exist(node2, 'second subnode exists');
        assert.ok(node2.label==page2.title 
            && results.page2_id == node2._id, 
            'second subnode properties match');

        done();
      });
    });
  });

  // 7. move page in tree
  test('POST /some/api/node/move/ID', function(done) {
    //TODO: will need to rewrite this after refactoring tree structure
    done();
  });

  // TODO:appears to be something wrong in the client library with DELETE
  // 8. delete pages
  test('GET /some/api/page/destroy/ID', function(done) {

    // delete page3
    client.path('/some/api/page/destroy/'+results.page3._id);
    client.get()(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==204, 'Status 204 delete page3');
      // check that page is deleted
      client.path('/some/api/page/rest/'+results.page3._id);
      client.get()(function(err, resp, body) {
        if (err) throw err;
        assert.ok(resp.statusCode==404, 'Status 404 page3');

        // check that node is deleted
        client.path('/some/api/node/rest/'+results.page3_node._id);
        client.get()(function(err, resp, body) {
          if (err) throw err;
          assert.ok(resp.statusCode==404, 'Status 404 page3_node');

          // check that node child reference is pulled
          client.path('/some/api/node/rest/'+results.page1_node._id);
          client.get()(function(err, resp, body) {
            if (err) throw err;
            assert.ok(resp.statusCode==200, 'Status 200 page1_node');
            var data = JSON.parse(body);
            assert.ok(data.children.length==1, 'page1 node has only 1 child');
            assert.ok(data[0]._id == results.page2_node._id, 'page1 child points to page2');

            // delete page2
            client.path('/some/api/page/destroy/'+results.page2._id);
            client.get()(function(err, resp, body) {
              if (err) throw err;
              assert.ok(resp.statusCode==204, 'Status 204 delete page2');

              // delete page1
              client.path('/some/api/page/destroy/'+results.page1._id);
              client.get()(function(err, resp, body) {
                if (err) throw err;
                assert.ok(resp.statusCode==204, 'Status 204 delete page1');

                done();
              });
            });
          });
        });
      });
    });
  });

});

