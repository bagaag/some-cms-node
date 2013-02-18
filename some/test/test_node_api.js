var assert = require("assert");
var should = require("should");
var mongoose = require('mongoose');
var cfg = require("./config.js");
var scopedClient = require("scoped-http-client");
var client = scopedClient.create(cfg.http.hostname)
              .port(cfg.http.port)
              .header('accept', 'application/json')
              .header('Content-Type','application/json');
var db = require('../lib/db');
var results = {}; // stored results for comparison between API and web service
var Node = db.model('Node');

function new_id(s) {
  return new mongoose.Types.ObjectId(s);
}

//TODO set root/non-root get, test sort order

suite('Node API:', function() {
    var NodeAPI = require('../lib/api_node.js');
    var nodeAPI = new NodeAPI({'db':db});

    test('#create()', function(done) {
      var p = {'children': [new_id("510b2dd586381c018b803feb")],
               'label': 'test label', 
               'target_id': new_id("510b2dd586381c018b803feb"),
               'target_type': 'some_nodes'};
      nodeAPI.create(p, function(err, node) {
        if(err) throw err;
        assert.ok(node.get('id'), 'No ID on created object');
        assert.ok(node.get('id').length>0, 'ID on created object has 0 length');
        assert.deepEqual(node.get('children')[0], p.children[0], 'Children persisted');
        assert.ok(node.get('label')==p.label, 'label persisted');
        assert.ok(node.get('target_type') == p.target_type, 'Target_type persisted');
        results.created = node;
        done();
      });
    });
    
    test('#list()', function(done) {
        nodeAPI.list({}, function(err, nodes) {
            if (err) throw err;
            assert(nodes.length>0, 'returned >0 nodes');
            results.list = nodes;
            for (var i=0; i<nodes.length; i++) {
                var node = nodes[i];
                should.exist(node._id, 'has field _id');
                should.exist(node.label, 'has field label');
                should.exist(node.children, 'has field children');
                should.exist(node.children.length, 'children is an array');
                should.exist(node.target_id, 'has field target_id');
                should.exist(node.target_type, 'has field target_type');
            }
            done();
        });
    });

    //TODO test w/ expected return data
    test('#list(parent_id)', function(done) {
      nodeAPI.list({parent_id: results.created.get('id') }, function(err, nodes) {
          if (err) throw err;
          results.children = nodes;
          assert(nodes.length==0, 'returned >0 nodes');
          done();
      });
    });
    test('GET /some/api/node/rest', function(done) {
        client.path('/some/api/node/rest');
        client.get()(function(err, resp, body) {
            if (err) throw err;
            assert.ok(resp.statusCode==200, 'Status 200');
            var data = JSON.parse(body);
            assert.ok(data.length>0, 'data.length > 0');
            assert.deepEqual(JSON.stringify(data), JSON.stringify(results.list), 'web service matches API result')
            done();
        });
    });

    test('GET /some/api/node/rest/_id', function(done) {
        client.path('/some/api/node/rest/'+results.created._id);
        client.get()(function(err, resp, body) {
            if (err) throw err;
            assert.equal(resp.statusCode,200, 'Status 200');
            var data = JSON.parse(body);
            assert.ok(data._id==results.created._id,'id matches');
            assert.ok(data.target_id==results.created.target_id,'target matches');
            done();
        });
    });

    test('#get()', function(done) {
      nodeAPI.get(results.created.get('id'), function(err, node) {
        if(err) throw err;
        should.exist(node, 'node should exist');
        function testp(field, deep) {
          if (deep) {
            assert.ok(JSON.stringify(node.get(field)) == JSON.stringify(results.created.get(field)), field + ' persisted');
          } else {
            assert.ok(node.get(field)===results.created.get(field), field + ' persisted');
          }
        }
        testp('id');
        testp('children', true);
        testp('target_id', true);
        testp('label',true);
        testp('target_type', true);
        done();
      });
    });

    test('#update()', function(done) {
      nodeAPI.get(results.created.get('id'), function(err, node) {
        if (err) throw err;
        node.set({'title':'updated title'});
        nodeAPI.update(node.toObject(), function(err, updated) {
          if (err) throw err;
          assert.ok(updated.get('title')===node.get('title'), 'Update persisted');
          done();
        });
      });
    });

    // creates a child that specifies its parent, then 
    // checks that it was added as a child, then deletes
    // it and checks that it is removed after the child
    // is destroyed
    test("#create with parent_id and child cleanup on destroy", function(done) {
      var parent_id = results.created.get('id');
      var c = {'children': [new_id("510b2dd586381c018b803feb")],
               'label': 'child node', 
               'target_id': new_id("510b2dd586381c018b803feb"),
               'target_type': 'some_nodes', 
               'parent_id': parent_id};
      nodeAPI.create(c, function(err, child) {
        if (err) throw err;
        var q = { children: new_id(child.get('id')) };
        Node.findOne(q, function(err, par) {
          if (err) throw err;
          assert.ok(par.get('id')==parent_id, 'child associated with paren');
          nodeAPI.destroy(child.get('id'), function(err) {
            if (err) throw err;
            Node.count(q, function(err, result) {
              assert.ok(result==0, 'child ID not found in children after destruction');
              done();
            });
          });
        });
      });
    });

    test('#destroy()', function(done) {
      nodeAPI.destroy(results.created.get('id'), function(err) {
        if (err) throw err;
        nodeAPI.get(results.created.get('id'), function(err, returned) {
          if (err) throw err;
          should.not.exist(returned);
          done();
        });
      });
    });

    test('POST /some/api/node/rest', function(done) {
        client.path('/some/api/node/rest');
        var p = {'children': [new_id("510b2dd586381c018b803feb")],
                'label': 'test label',
                'target_id': new_id("510b2dd586381c018b803feb"),
                'target_type': 'some_nodes'};
        client.post(JSON.stringify(p))(function(err, resp, body) {
          if (err) throw err;
          assert.ok(resp.statusCode==201, 'Status 201');
          should.exist(resp.headers['location'],'should return Location header');
          results.location = resp.headers['location'];
          done();
        });
    });

    test('GET /some/api/node/rest/ID', function(done) {
      var get = scopedClient.create(results.location)
        .header('accept', 'application/json')
        .get()(function(err, resp, body) {
          if (err) throw err;
          assert.ok(resp.statusCode==200, 'Status 200');
          var data = JSON.parse(body);
          should.exist(data._id, 'result has ._id');
          should.exist(data.label, 'result has .label');
          should.exist(data.children, 'result has .children');
          should.exist(data.target_id, 'result has .target_id');
          should.exist(data.target_type, 'result has .target_type');
          results.rest_created = data;
          done();
        });
    });

    test('PUT /some/api/node/rest/ID', function(done) {
      var target_type = results.rest_created.target_type;
      results.rest_created.target_type = 'some_other_type';
      client.path('/some/api/node/rest/'+results.rest_created._id);
      client.put(JSON.stringify(results.rest_created))(function(err, resp, body) {
          if (err) throw err;
          assert.ok(resp.statusCode==204, 'Status 204');
          nodeAPI.get(results.rest_created._id, function(err, node) {
            if (err) throw err;
            assert.ok(node.target_type==='some_other_type', 'updated target_type persisted');
            results.rest_updated = node.toObject();
            done();
          });
        });
    });

    /*
    // TODO:appears to be something wrong in the client library with DELETE
    */

    test('GET /some/api/node/destroy/ID', function(done) {
      client.path('/some/api/node/destroy/'+results.rest_updated._id);
      client.get()(function(err, resp, body) {
        if (err) throw err;
        assert.ok(resp.statusCode==204, 'Status 204');
        nodeAPI.get(results.rest_created._id, function(err, node) {
          if (err) throw err;
          should.not.exist(node,'node should not exist after deletion');
          done();
        });
      });
    });
});


