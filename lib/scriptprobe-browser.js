var async       = require('async');
var URL         = require('url');
var Browser     = require('zombie');

var spserver    = require('./scriptprobe-server.js');
var browserRefs = require('./browser_refs.js');
var cdn         = require('./cdn.js');

var code,
    results = {};

function loadScriptInBrowser(serverHostname, c, remoteServer, callback) {
    Browser.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2';
    Browser.site = 'http://' + serverHostname;
    code = c;

    if (!remoteServer) {
        var internalServer = spserver.getServer();
    }

    // Open some browsers and analyse results.
    async.parallel([
        analysePage,
        detectFunctionCalls
    ], function() {
        if (!remoteServer) {
            internalServer.close();
        }
        // Send results in callback.
        callback(results);
    });
}

function analysePage(callback) {
    var browser = new Browser();
    browser.visit('/first?code=' + encodeURIComponent(code), function () {

        function countElements(el) {
            return browser.document.querySelectorAll(el).length;
        }

        results['globalVars'] = getGlobals(browser.evaluate('window'));
        results['additionalScripts'] = countElements('script[src]') - 1;
        results['additionalCss'] = countElements('style[href]');
        results['additionalImages'] = countElements('img');
        results['additionalIframes'] = countElements('iframe');
        results['totalHttpRequests'] =  browser.resources.length - 1;
        results['totalBytes'] = 0;

        // Add response details for each request sent by the browser.
        results['httpRequests'] = [];
        var resources = browser.resources;
        for (var i = 1, j = resources.length; i<j; ++i) {
            var response = normaliseResponse(resources[i]._response);
            var result = {
                url: resources[i].request.url,
                statusCode: response.statusCode,
                bodySize: response.body.length,
                cacheControl: response.getHeader('cache-Control'),
            }
            results['totalBytes'] += parseInt(result.bodySize);
            results['httpRequests'].push(result);
        }

        // Check if initial request was on CDN.
        var parsedUrl = URL.parse(resources[1].url);
        cdn.isCdnHostname(parsedUrl.hostname, function(isCdn) {
            results['cdn'] = isCdn;
            callback();
        });
    });
}

function detectFunctionCalls(callback) {
    var browser = new Browser();
    browser.visit('/second?code=' + encodeURIComponent(code), function () {
        results['additionalXHR'] = browser.evaluate('ScriptProbe.xhr');
        results['documentDotWrite'] = browser.evaluate('ScriptProbe.documentDotWrite') || false;
        callback();
    });
}

function normaliseResponse(response) {

    // Lowercase header names and values for later comparison.
    response.lowerCaseHeaders = {};
    for (var header in response.headers) {
        if (header.toLowerCase() !== 'set-cookie') {
            response.lowerCaseHeaders[header.toLowerCase()] = response.headers[header].toLowerCase();
        }
    }

    //Some helper functions to check and get HTTP headers.
    response.checkHeader = function(name, value) {
        return this.lowerCaseHeaders[name.toLowerCase()] === value.toLowerCase();
    }
    response.getHeader = function(name) {
        return this.lowerCaseHeaders[name.toLowerCase()];
    }

    return response;
}

function getGlobals(win) {
    // Get all global vars that aren't in browser white list.
    var globals = [];
    for (var name in win) {
        if (browserRefs.indexOf(name) < 0) {
            globals.push(name);
        }
    }
    return globals;
}

module.exports = {
    loadScriptInBrowser: loadScriptInBrowser,
    normaliseResponse: normaliseResponse
}