var assert = require("assert");
var should = require("should");
var cfg = require("./config.js");
var scopedClient = require("scoped-http-client");
var client = scopedClient.create(cfg.http.hostname)
              .port(cfg.http.port)
              .header('accept', 'application/json')
              .header('Content-Type','application/json');
var db = require('../lib/db');
var results = {}; // stored results for comparison between API and web service

suite('Page API:', function() {
    var PageAPI = require('../lib/api_page.js');
    var pageAPI = new PageAPI({'db':db});

    test('#list()', function(done) {
        pageAPI.list({}, function(err, pages) {
            if (err) throw err;
            assert(pages.length>0, 'returned >0 pages');
            results.list = pages;
            for (var i=0; i<pages.length; i++) {
                var page = pages[i];
                should.exist(page._id, 'has field _id');
                should.exist(page.title, 'has field title');
                should.exist(page.body, 'has field body');
            }
            done();
        });
    });

    test('GET /some/api/page/rest', function(done) {
        client.path('/some/api/page/rest');
        client.get()(function(err, resp, body) {
            if (err) throw err;
            assert.ok(resp.statusCode==200, 'Status 200');
            var data = JSON.parse(body);
            assert.ok(data.length>0, 'data.length > 0');
            assert.deepEqual(JSON.stringify(data), JSON.stringify(results.list), 'web service matches API result')
            done();
        });
    });

    test('#create()', function(done) {
      var p = {'title':'test PageAPI.create','body':'test body'};
      pageAPI.create(p, function(err, page) {
        if(err) throw err;
        assert.ok(page.get('id'), 'No ID on created object');
        assert.ok(page.get('id').length>0, 'ID on created object has 0 length');
        assert.ok(page.get('title')===p.title, 'Title persisted');
        assert.ok(page.get('body')===p.body, 'Body persisted');
        results.created = page;
        done();
      });
    });
    
    test('#get()', function(done) {
      pageAPI.get(results.created.get('id'), function(err, page) {
        if(err) throw err;
        should.exist(page, 'page should exist');
        function testp(field) {
          assert.ok(page.get(field)===results.created.get(field), field + ' persisted');
        }
        testp('id');
        testp('title');
        testp('body');
        done();
      });
    });

    test('#update()', function(done) {
      pageAPI.get(results.created.get('id'), function(err, page) {
        if (err) throw err;
        page.set({'title':'updated title'});
        pageAPI.update(page.toObject(), function(err, updated) {
          if (err) throw err;
          assert.ok(updated.get('title')===page.get('title'), 'Update persisted');
          done();
        });
      });
    });

    test('#destroy()', function(done) {
      pageAPI.destroy(results.created.get('id'), function(err) {
        if (err) throw err;
        pageAPI.get(results.created.get('id'), function(err, returned) {
          if (err) throw err;
          should.not.exist(returned);
          done();
        });
      });
    });

    test('POST /some/api/page/rest', function(done) {
        client.path('/some/api/page/rest');
        var p = {'title':'test created via rest','body':'test'}; 
        client.post(JSON.stringify(p))(function(err, resp, body) {
          if (err) throw err;
          assert.ok(resp.statusCode==201, 'Status 201');
          should.exist(resp.headers['location'],'should return Location header');
          results.location = resp.headers['location'];
          done();
        });
    });

    test('GET /some/api/page/rest/ID', function(done) {
      var get = scopedClient.create(results.location)
        .header('accept', 'application/json')
        .get()(function(err, resp, body) {
          if (err) throw err;
          assert.ok(resp.statusCode==200, 'Status 200');
          var data = JSON.parse(body);
          should.exist(data._id, 'result has ._id');
          should.exist(data.title, 'result has .title');
          should.exist(data.body, 'result has .body');
          results.rest_created = data;
          done();
        });
    });

    test('PUT /some/api/page/rest/ID', function(done) {
      var orig_title = results.rest_created.title;
      results.rest_created.title = 'modified title';
      client.path('/some/api/page/rest/'+results.rest_created._id);
      client.put(JSON.stringify(results.rest_created))(function(err, resp, body) {
          if (err) throw err;
          assert.ok(resp.statusCode==204, 'Status 204');
          pageAPI.get(results.rest_created._id, function(err, page) {
            if (err) throw err;
            assert.ok(page.title==='modified title', 'updated title persisted');
            results.rest_updated = page.toObject();
            done();
          });
        });
    });

    /*
    // TODO:appears to be something wrong in the client library with DELETE
    test('DELETE /some/api/page/rest/ID', function(done) {
      client.path('/some/api/page/rest/'+results.rest_updated._id);
      client.del(JSON.stringify(results.rest_updated))(function(err, resp, body) {
        if (err) throw err;
        assert.ok(resp.statusCode==204, 'Status 204');
        pageAPI.get(results.rest_created._id, function(err, page) {
          if (err) throw err;
          should.not.exist(page,'page should not exist after deletion');
          done();
        });
      });
    });
    */

    test('GET /some/api/page/destroy/ID', function(done) {
      client.path('/some/api/page/destroy/'+results.rest_updated._id);
      client.get()(function(err, resp, body) {
        if (err) throw err;
        assert.ok(resp.statusCode==204, 'Status 204');
        pageAPI.get(results.rest_created._id, function(err, page) {
          if (err) throw err;
          should.not.exist(page,'page should not exist after deletion');
          done();
        });
      });
    });
});

