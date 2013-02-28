var assert = require("assert");
var should = require("should");
var cfg = require("./config.js");
var scopedClient = require("scoped-http-client");
var client = scopedClient.create(cfg.http.hostname)
              .port(cfg.http.port)
              .header('accept', 'application/json')
              .header('Content-Type','application/json');
var results = {}; // stored results for comparison between API and web service

suite('Node API:', function() {

  function validate_node(data) {
    should.exist(data._id, 'result has ._id');
    should.exist(data.label, 'result has .label');
    should.ok(data.parent_id==null || data.parent_id, 'result has .parent_id');
    should.exist(data.target_id, 'result has .target_id');
    should.exist(data.target_type, 'result has .target_type');
    should.exist(data.order, 'result has .order');
  }

  // get root nodes
  test('GET /some/api/node/rest', function(done) {
    client.path('/some/api/node/rest');
    client.get()(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==200, 'Status 200');
      var data = JSON.parse(body);
      assert.ok(data.length>0, 'returns > 0 nodes');
      for (var i=0; i<data.length; i++) {
        validate_node(data[i]);
      }
      results.list = data;
      done();
    });
  });

  // get a single node
  test('GET /some/api/node/rest/ID', function(done) {
    client.path('/some/api/node/rest/'+results.list[0]._id);
    client.get()(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==200, 'Status 200');
      var data = JSON.parse(body);
      validate_node(data);
      assert.ok(data._id == results.list[0]._id, '_id value matches');
      done();
    });
  });

  // update a node
  test('PUT /some/api/node/rest/ID', function(done) {
    client.path('/some/api/node/rest/'+results.list[0]._id);
    var n = results.list[0];
    client.put(JSON.stringify(n))(function(err, resp, body) {
      if (err) throw err;
      assert.ok(resp.statusCode==204, 'Status 204 (got'+resp.statusCode+')');
      done();
    });
  });

});


