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
