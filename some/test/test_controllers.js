var assert = require("assert");
var db = require('../lib/db');

suite('controllers.js', function() {
    var controllers;
    
    function CustomController() {
        this.hello = function(req, res) {
            res.send({'say':'Hello.'});
        };        
    }
    
    test('instantiation', function(done) {
        var params = {
            'custom_api_controllers': {
                'custom1':CustomController
            }, 
            'db': db
        };
        var Controllers = require('../controllers.js');
        controllers = new Controllers(params);
        assert.ok(typeof controllers == 'object', 'controllers is an object');
        done();
    });
    
    test('#route_api()', function(done) {
        var req = {'params':{'section':'test', 'action':'test'}}, res = {};
        res.send = function(s) {
            assert.equal(s, 'OK', 'routing to test controller');
            done();
        }
        controllers.route_api(req, res);
    });
    
    test('custom_api_controllers', function(done) {
        var req = {'params':{'section':'custom1', 'action':'hello'}}, res = {};
        res.send = function(obj) {            
            assert.equal(obj.say, 'Hello.', 'routing to custom controller');
            done();
        }
        controllers.route_api(req, res);
    });

    test('api_controller_404_section', function(done) {
        var req = {'params':{'section':'custom2', 'action':'hello'}}, res = {};
        res.send = function(status, err) {            
          assert.equal(status,'404','404 status');
          assert.ok(err.error.message.indexOf('Unmapped')===0, 'error message');
          done();
        }
        controllers.route_api(req, res);
    });

    test('api_controller_404_action', function(done) {
        var req = {'params':{'section':'custom1', 'action':'hellox'}}, res = {};
        res.send = function(status, err) {            
            assert.equal(status,'404','404 status');
            assert.ok(err.error.message.indexOf('Unmapped')===0, 'error message');
            done();
        }
        controllers.route_api(req, res);
    });
});
