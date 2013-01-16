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

exports.error = function(e) {
  if (typeof e === 'string') {
    return {"error":{"message":e }};
  } else if (typeof e === 'object') {
    return {"error":{"message":e.message, "stack":e.stack}};
  } 
  else return 'Unknown error';
}

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
