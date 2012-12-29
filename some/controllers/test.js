// dummy controller for testing controller.js
function TestController(params) {

    this.test = function(req, res) {
        res.send('OK');
    };
}

module.exports = TestController;