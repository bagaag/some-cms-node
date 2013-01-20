var assert = require("assert");
suite('lib/someutils.js', function() {
    
    test('#format()', function(done) {
        var app = {'settings':{'env':'development'}};
        var d = {'id':'12345'};
        var res = {'setHeader':function(){}, 'send':function(data){
            assert(typeof data == 'string', 'sent data is a string');
            data = JSON.parse(data);
            assert(data.id==d.id, 'sent data is object provided');
        }};
        var util = require('../lib/someutils.js');
        util.format(app, res, d);
        done();
    });
});
