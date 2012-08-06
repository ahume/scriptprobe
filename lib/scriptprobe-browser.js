var http        = require('http');
var async       = require('async');
var Browser     = require('zombie');

var spserver      = require('./scriptprobe-server.js');
var browserRefs   = require('./browser_refs.js');

var serverHostname;
var url;
var results = {};

var options = {
	'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2'
}


function analysePage(callback) {
    var browser = new Browser();
    browser.visit('http://' + serverHostname + '/first?url=' + encodeURIComponent(url), options, function () {
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

        console.log(browser.resources[1].request.headers);

        // Add response details for each request.
        results['httpRequests'] = []
        for (var i = 1, j = browser.resources.length; i<j; ++i) {
        	var response = browser.resources[i]._response;
        	response = normaliseResponse(response);
        	var result = {
        		statusCode: response.statusCode,
        		bodySize: response.body.length,
        		gzip: response.checkHeader('Content-Encoding', 'gzip'),
        		cacheControl: response.getHeader('cache-Control')
        	}
    		results['httpRequests'].push(result);
        }
        callback();
    });
}

function detectFunctionCalls(callback) {
    var browser = new Browser();
    browser.visit('http://' + serverHostname + '/second?url=' + encodeURIComponent(url), options, function () {
        results['additionalXHR'] = browser.evaluate('ScriptProbe.xhr');
        results['documentDotWrite'] = browser.evaluate('ScriptProbe.documentDotWrite') || false;
        callback();
    });
}

function loadScriptInBrowser(sh, urlToTest, remoteServer, callback) {
	url = urlToTest;
	serverHostname = sh;
    if (!remoteServer) {
        var internalServer = spserver.getServer();
    }

    async.parallel([
        analysePage,
        detectFunctionCalls
    ], function() {
        if (!remoteServer) {
            internalServer.close();
        }
        callback(results);
    });
}

function normaliseResponse(response) {
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

    return response;
}

module.exports = {
    loadScriptInBrowser: loadScriptInBrowser
}