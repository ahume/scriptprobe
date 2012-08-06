var fs       = require('fs');
var http     = require('http');
var url     = require('url');
var mustache = require('mustache');

function getServer() {
    var template = fs.readFileSync(__dirname + '/harness.html').toString();

    server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});

        var parsedUrl = url.parse(req.url, true);
        switch(parsedUrl.pathname) {
            case '/first':
                var output = mustache.to_html(template, {'code': parsedUrl.query.code});
                break;
            case '/second':
                var output = mustache.to_html(template, {'code': parsedUrl.query.code, 'second':true});
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