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

// wait for parallel tasks to be completed before a callback, with timeout
//TODO: Unit test for someutils.Parallel
exports.Parallel = function(taskcount, waitms, callback) {
    var self = this;
    this.tasks = taskcount;
    this.current = 0;
    this.waitms = waitms;
    this.completed = [];
    this.timeout_id = setTimeout(this.timed_out, this.waitms);
    this.timed_out = function() {
        throw Error('Parallel tasks timed out after completing '
            + JSON.stringify(self.completed));
    };
    this.start = function() {
    };
    this.done = function(o) { 
        self.completed.push(o); 
        if (self.completed.length==self.tasks) {
            clearTimeout(self.timeout_id);
            callback();
        }
    };
};
