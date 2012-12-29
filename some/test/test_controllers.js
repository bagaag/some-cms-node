var assert = require("assert");
suite('controllers.js', function() {
    var controllers;
    test('instantiation', function() {
        controllers = require('../controllers.js')({});
        assert.ok(typeof controllers == 'function', 'controllers is a function');
    });
    test('#route_api()', function() {
        var req = {'params':{'section':'test', 'action':'test'}}, res = {};
        res.send = function(s) {
            assert.equal(s, 'OK', 'routing to test controller');
        }
        controllers.route_api(req, res);
    });
});
