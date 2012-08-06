#!/usr/bin/env node

var http        = require('http');
var fs          = require('fs');
var async       = require('async');
var urlm        = require('url');
var program     = require('commander');

var spserver      = require('./scriptprobe-server.js');
var spbrowser      = require('./scriptprobe-browser.js');
var cdn           = require('./cdn.js');

var serverHostname = '127.0.0.1:1337';
var remoteServer   = false;
var results        = {};
var url, tag;
var parsed_url;


function testCodeSnippet(code, remoteServerHostname, callback) {
    if (remoteServerHostname) {
        serverHostname = remoteServerHostname;
        remoteServer = true;
    }
    spbrowser.loadScriptInBrowser(serverHostname, code, remoteServer, function(r) {
        results = r;
        loadScript(results.httpRequests[0].url, function() {
            callback(results)
        });
    });
}

function loadScript(url, callback) {
    url = urlm.parse(url);
    var options = {
        host: url.hostname,
        path: url.path,
        headers: {
            'Accept-Encoding': 'gzip,deflate,sdch',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2'
        }
    };
    http.get(options, function(res) {
        response = spbrowser.normaliseResponse(res);
        results['gzip'] = response.checkHeader('Content-Encoding', 'gzip');
        callback();
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback();
    });
}

module.exports = {
    testCodeSnippet: testCodeSnippet,
    getServer: spserver.getServer
}

// If we're running from CLI
if (!module.parent) {

    program
        .version('0.0.1')
        .option('-U --url <url>', 'URL to test')
        .option('-R --remote <remote>', 'Remote test server')
        .parse(process.argv);

    console.log("Testing: ", program.url);
    testCodeSnippet(program.url, program.remote, function(results) {
        // if (results.statusCode !== 200) {
        //     console.log("Document Not Found");
        //     console.log("------------------");
        // }
        console.log(JSON.stringify(results, null, 4));
    });

}