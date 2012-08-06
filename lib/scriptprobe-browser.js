var async       = require('async');
var urlm        = require('url');
var Browser       = require('zombie');

var spserver      = require('./scriptprobe-server.js');
var browserRefs   = require('./browser_refs.js');
var cdn           = require('./cdn.js');

var url;
var results = {};


function analysePage(callback) {
    var browser = new Browser();
    browser.visit('/first?url=' + encodeURIComponent(url), function () {
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
        results['totalHttpRequests'] =  browser.resources.length - 1,
        results['totalBytes'] = 0;

        // Add response details for each request.
        results['httpRequests'] = [];
        var resources = browser.resources;
        for (var i = 1, j = resources.length; i<j; ++i) {
        	var response = resources[i]._response;
        	response = normaliseResponse(response);
        	var result = {
                url: resources[i].request.url,
        		statusCode: response.statusCode,
        		bodySize: response.body.length,
        		cacheControl: response.getHeader('cache-Control'),
        	}
            results['totalBytes'] += parseInt(result.bodySize);
            results['httpRequests'].push(result);
        }
        if (resources.length > 1) {
            var parsedUrl = urlm.parse(resources[1].url);
            cdn.isCdnHostname(parsedUrl.hostname, function(isCdn) {
                results['cdn'] = isCdn;
                callback();
            });
        } else {
            callback();
        } 

    });
}

function detectFunctionCalls(callback) {
    var browser = new Browser();
    browser.visit('/second?url=' + encodeURIComponent(url), function () {
        results['additionalXHR'] = browser.evaluate('ScriptProbe.xhr');
        results['documentDotWrite'] = browser.evaluate('ScriptProbe.documentDotWrite') || false;
        callback();
    });
}

function loadScriptInBrowser(serverHostname, urlToTest, remoteServer, callback) {
    Browser.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2';
    Browser.site = 'http://' + serverHostname;

	url = urlToTest;
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
    loadScriptInBrowser: loadScriptInBrowser,
    normaliseResponse: normaliseResponse
}