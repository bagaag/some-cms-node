var assert = require("assert");
var FrontController = require("../controllers/front.js");
var db = require('../lib/db');

suite('controllers/front.js [from test_front.js]', function() {
    
    // failure for this test is timeout
    test('request.locals passthrough', function(done) {
        var test_val = 'ghjl5h3kj';
        var mock_req = {
            'path': '/test'
            ,'locals': {'test_key': test_val}
        }; 
        var mock_res = {
            "render": function(view, data) {
                front.parallel.done(view);
                if (data.test_key==test_val) {
                    done(); 
                }
            }
        };
        var mock_next = function() {};
        var params = {"db": db};
        var front = new FrontController(params);
        front.display(mock_req, mock_res, mock_next);
    });
    
    //TODO: test to validate page & locations viewdata provided to templates (need a consistent test case in db)
});
