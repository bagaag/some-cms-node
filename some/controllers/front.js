var someutils = require('../lib/someutils.js');

function FrontController(params) {

    var pageAPI = new require('../lib/api_page.js')(params);
    
    /** Display a page based on the requested path */
    this.display = function(req, res, next) {
        var self = this;
        var path = req.path;
        // middleware can provide data to views via request.locals
        var viewdata = req.locals || {};
        var partials = [];    
        //TODO: implement some kind of exclusion mechanism to make this more efficient and to keep pages from being created at certain paths        
        if (path.indexOf('/some')===0 || path.indexOf('/favicon.ico')===0) {
            next();
            return;
        }
        var page = {
            '_id':'1'
            , 'title':'Sample Page'
            , 'body':'This is the body text for '+path+'.'
            , 'layout':'index'
            , 'partial':'page' // should be default
        };//TODO: implement and replace above with pageAPI.resolvePath(path);
        page.location='body'; 
        if (page.partial) partials.push(page);
        viewdata.page = page;
        //TODO: location pages don't require locations, so these should probably be stored separately
        var locations = { 
            'alert': {'_id':'2','title':'January Maintenance','body':'Notice: This site will be down for maintenance on January 13 from 1am-3am EST.'}
            //TODO: implement global locations, e.g. footer
            //TODO: partial gets overriden by the location applied
            , 'footer': {'_id':'3','title':'Footer','body':'Copyright 2013', 'partial':'footer'} 
        };
        for (var name in locations) {
            var p = locations[name];
            p.location = name;
            if (p.partial) partials.push(p);
            viewdata[name] = p;
        }
        // render partials
        var partial_prefix = 'partials/'; //TODO: make this configurable        
        // render and return the final layout (this happens last)
        var render_layout = function() {
            res.render(page.layout, viewdata);
        } 
        // wait for all partials to be rendering before rendering layout
        this.parallel = new someutils.Parallel(partials.length, render_layout);
        // generate an event handler for each pg in the loop below
        var partial_render_handler = function(pg) {
            return function(err, rendered) {
                if (err) throw err;
                pg.rendered = rendered;
                if (pg._id == page._id) viewdata.body = rendered;
                self.parallel.done(pg.location);
            }
        }
        for (var i=0; i<partials.length; i++) {
            var pg = partials[i];
            var partialdata = {
                'page': pg,
                'parent': viewdata
            };
            res.render(partial_prefix + pg.partial, partialdata, partial_render_handler(pg));
        }
    };
}

module.exports = FrontController;