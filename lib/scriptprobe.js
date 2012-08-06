#!/usr/bin/env node

var http    = require('http');
var fs      = require('fs');
var async   = require('async');
var URL     = require('url');
var program = require('commander');

var spserver  = require('./scriptprobe-server.js');
var spbrowser = require('./scriptprobe-browser.js');
var cdn       = require('./cdn.js');

var serverHostname = '127.0.0.1:1337';
var remoteServer   = false;
var results        = {};
var code;


function testCodeSnippet(code, remoteServerHostname, callback) {

    // If only a URL was passed in, add the script element.]
    var codeIsUrl = (code.indexOf('http://') === 0);
    if (codeIsUrl) {
        code = '<script src="' + code + '"></script>';
    }

    // Use a remote server for tests if available.
    if (remoteServerHostname) {
        serverHostname = remoteServerHostname;
        remoteServer = true;
    }
    // Load the script in headless browser.
    spbrowser.loadScriptInBrowser(serverHostname, code, remoteServer, function(r) {
        results = r;
        // Then call the initial script directly for better header detection.
        loadScript(results.httpRequests[0].url, function() {
            callback(results);
        });
    });
}

// Call the script directly for more accurate
// header detection.
function loadScript(url, callback) {
    var parsedUrl = URL.parse(url);
    var options = {
        host: parsedUrl.hostname,
        path: parsedUrl.path,
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
        console.log('Got error: ' + e.message);
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
        .option('-U --code <code>', 'Code to test')
        .option('-R --remote <remote>', 'Remote test server')
        .parse(process.argv);

    console.log('Testing: ', program.code);
    testCodeSnippet(program.code, program.remote, function(results) {
        console.log(JSON.stringify(results, null, 4));
    });

}