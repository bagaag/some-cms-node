var assert = require("assert");
var utils = require('../../lib/someutils.js');
var mongoose;

before(function(done){
    mongoose = require('../../lib/db.js');
    done();
});
after(function(done){
    mongoose.disconnect(function() {
        done();
    })
});

suite('controllers/pages.js', function() {
    var PageController;
    test('loading', function() {
        PageController = require('../../controllers/pages.js');
        assert.ok(typeof PageController == 'function', 
                'PageController is a function');
    };
    test('#list()', function() {
        var params = {'mongoose':mongoose, 'utils':utils};
        var pageController = new PageController(params);
        var list = pageController.list(req, res);
        
        
        var app = {'settings':{'env':'development'}};
        var d = {'id':'12345'};
        var res = {'setHeader':function(){}, 'send':function(data){
            assert(typeof data == 'string', 'sent data is a string');
            data = JSON.parse(data);
            assert(data.id==d.id, 'sent data is object provided');
        }};
        var util = require('../../controllers/util.js');
        util.format(app, res, d);
    });
});