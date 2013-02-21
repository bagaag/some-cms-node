// dummy controller for testing controller.js
function TestController(app) {

    this.test = function(req, res) {
        res.send('OK');
    };
}

module.exports = TestController;
