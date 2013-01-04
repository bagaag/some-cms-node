// handle a json return for either human or JavaScript consumption
exports.format = function(app, res, data) {
    if (app.settings.env == 'development') {
        res.setHeader('content-type', 'text/plain');
        res.send(JSON.stringify(data, null, '  '));
    }
    else {
        res.setHeader('content-type', 'application/json');
        res.send(data);
    }
};

// wait for parallel tasks to be completed before a callback
//TODO: Unit test for someutils.Parallel
exports.Parallel = function(taskcount, callback) {
    var self = this;
    this.tasks = taskcount;
    this.completed = [];
    this.done = function(o) { 
        self.completed.push(o); 
        if (self.completed.length==self.tasks) {
            callback();
        }
    };
};
