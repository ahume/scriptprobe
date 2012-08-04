#!/usr/bin/env node

var http        = require('http');
var dns         = require('dns');
var fs          = require('fs');
var urlm        = require('url');
var async       = require('async');
var Browser     = require('zombie');
var program     = require('commander');

var spserver      = require('./scriptprobe-server.js');
var browserRefs   = require('./browser_refs.js');
var cdn           = require('./cdn.js');

var serverHostname = '127.0.0.1:1337';
var remoteServer   = false;
var results        = {};
var url;
var parsed_url;


function ScriptTest(urlToTest, remoteServerHostname) {
    this.url = urlToTest;
    url = urlToTest;
    if (remoteServerHostname) {
        serverHostname = remoteServerHostname;
        remoteServer = true;
    }
}

ScriptTest.prototype.go = function(callback) {
    this.callback = callback;
    parsedUrl = urlm.parse(url);
    var me = this;
    async.parallel([
        function(callback) {
            me.loadScript(function() {
                callback();
            });
        },
        function(callback) {
            me.loadScriptInBrowser(function() {
                callback();
            });
        }    
    ], function(err, r) {
        me.callback(results);
    });
}

ScriptTest.prototype.loadScript = function(callback) {

    var options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        port: parsedUrl.port,
        headers: {
            'Accept-Encoding': 'gzip,deflate,sdch',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2'
        }
    }

    var me = this;
    var cb = function(response) {
        var body = '';

        response.on('data', function(chunk) {
            body += chunk;
        })
        response.on('end', function() {
            me.detailResponse(body, response, function() {
                callback();
            });
        });
    }

    http.request(options, cb).end();
}

ScriptTest.prototype.detailResponse = function(body, response, callback) {
    response.lowerCaseHeaders = {};
    for (var header in response.headers) {
        if (header.toLowerCase() !== 'set-cookie') {
            response.lowerCaseHeaders[header.toLowerCase()] = response.headers[header].toLowerCase();
        }
    }

    response.checkHeader = function(name, value) {
        return this.lowerCaseHeaders[name.toLowerCase()] === value.toLowerCase();
    }

    response.getHeader = function(name) {
        return this.lowerCaseHeaders[name.toLowerCase()]
    }

    results['statusCode'] = response.statusCode;
    results['bodySize'] = body.length;
    results['gzip'] = response.checkHeader('Content-Encoding', 'gzip');
    results['cacheControl'] = response.getHeader('cache-Control');

    cdn.isCdnHostname(parsedUrl.hostname, function(isCdn) {
        results['cdn'] = isCdn;
        callback();
    });
}

ScriptTest.prototype.analysePage = function(callback) {
    var browser = new Browser();
    browser.visit('http://' + serverHostname + '/first?url=' + encodeURIComponent(url), function () {

        var refsAdded = [];
        for (var name in browser.evaluate('window')) {
            if (browserRefs.indexOf(name) < 0) {
                refsAdded.push(name);
            }
        }

        function countElements(el) {
            return browser.document.querySelectorAll(el).length;
        }

        results['globalVars'] = refsAdded;
        results['additionalScripts'] = countElements('script[src]') - 1;
        results['additionalCss'] = countElements('style[href]');
        results['additionalImages'] = countElements('img');
        results['additionalIframes'] = countElements('iframe');
        callback();
    });
}

ScriptTest.prototype.detectFunctionCalls = function(callback) {
    var browser = new Browser();
    browser.visit('http://' + serverHostname + '/second?url=' + encodeURIComponent(url), function () {
        results['additionalXHR'] = browser.evaluate('ScriptProbe.xhr');
        results['documentDotWrite'] = browser.evaluate('ScriptProbe.documentDotWrite') || false;
        callback();
    });
}

ScriptTest.prototype.loadScriptInBrowser = function(callback) {

    if (!remoteServer) {
        var internalServer = spserver.getServer(this.url);
    }

    async.parallel([
        this.analysePage,
        this.detectFunctionCalls
    ], function() {
        if (!remoteServer) {
            internalServer.close();
        }
        callback();
    });
}

module.exports = {
    ScriptTest: ScriptTest,
    getServer: spserver.getServer
}

// If we're running from CLI
if (!module.parent) {

    program
        .version('0.0.1')
        .option('-U --url <url>', 'URL to test')
        .parse(process.argv);

    if (program.url) {
        console.log("Testing: ", program.url);
        var test = new ScriptTest(program.url);
        test.go(function(results) {
            if (results.statusCode !== 200) {
                console.log("Document Not Found");
                console.log("------------------");
            }
            console.log(results);
            console.log(results.globalVars);
        });
    }
}