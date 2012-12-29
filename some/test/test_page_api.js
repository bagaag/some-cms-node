var assert = require("assert");
var should = require("should");
var cfg = require("./config.js");
var scopedClient = require("scoped-http-client");
var client = scopedClient.create(cfg.http.hostname)
              .port(cfg.http.port)
              .header('accept', 'application/json');

suite('api/page', function() {
    
    test('/list', function(done) {
        client.path('/some/api/page/list');
        client.get()(function(err, resp, body) {
            var data = JSON.parse(body);
            should.exist(data.pages, 'data.pages exists');
            assert(data.pages.length>0, 'returned >0 pages');
            for (var i=0; i<data.pages.length; i++) {
                var page = data.pages[i];
                should.exist(page._id, 'has field _id');
                should.exist(page.title, 'has field title');
                should.exist(page.body, 'has field body');
            }
            done();
        });
    });
    
});
