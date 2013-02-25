var assert = require("assert");

suite('controllers.js', function() {
    var controllers;
    
    function CustomController() {
        this.hello = function(req, res) {
            res.send({'say':'Hello.'});
        };        
    }

    var app = {some:{}};
    app.some.utils = require('../lib/someutils.js');
    app.config = require('../../config.js');
    require('../lib/db')(app);
    require('../models')(app);
    
    test('instantiation', function(done) {
        app.config.custom_api_controllers = {'custom1':CustomController};

        var Controllers = require('../controllers');
        controllers = new Controllers(app);
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
