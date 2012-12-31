var assert = require("assert");
var should = require("should");
var cfg = require("./config.js");
var scopedClient = require("scoped-http-client");
var client = scopedClient.create(cfg.http.hostname)
              .port(cfg.http.port)
              .header('accept', 'application/json');
var db = require('../lib/db');
var results = {}; // stored results for comparison between API and web service

suite('Page API', function() {
    var PageAPI = require('../lib/api_page.js');
    var pageAPI = new PageAPI({'db':db});

    test('API #list()', function(done) {
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
    
    test('WEB #list()', function(done) {
        client.path('/some/api/page/list');
        client.get()(function(err, resp, body) {
            var data = JSON.parse(body);
            should.exist(data.pages, 'data.pages exists');
            assert.deepEqual(JSON.stringify(data.pages), JSON.stringify(results.list), 'web service matches API result')
            done();
        });
    });
});

