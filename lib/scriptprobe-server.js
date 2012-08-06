var fs       = require('fs');
var http     = require('http');
var urlm     = require('url');
var mustache = require('mustache');

function getServer() {
    var template = fs.readFileSync(__dirname + '/../harness.html').toString();

    server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});

        var url_parts = urlm.parse(req.url, true);
        switch(url_parts.pathname) {
            case '/first':
                var output = mustache.to_html(template, {'url':url_parts.query.url});
                break;
            case '/second':
                var output = mustache.to_html(template, {'url':url_parts.query.url, 'second':true});
                break;
        }
        res.end(output);
    });
    var port = process.env.PORT || 1337;
    server.listen(port, function() {
        console.log('Listening on ' + port);
    });
    return server;
}

module.exports = {
    getServer: getServer
}