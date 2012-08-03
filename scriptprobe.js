#!/usr/bin/env node

var http      = require('http');
var url       = require('url');
var Sandbox   = require('sandbox');
var Browser   = require('zombie');
var program = require('commander');


function testBrowser() {
    var browser = new Browser();
    browser.visit("http://google.com", function () {

      console.log(browser.text("title"));

    });
}

function ScriptTest(url) {
    this.url = url;
    this.makeRequest();
}

ScriptTest.prototype.makeRequest = function() {

    var parsedUrl = url.parse(this.url);

    var options = {
        host: parsedUrl.host,
        path: parsedUrl.path,
        headers: {
            'Accept-Encoding': 'gzip,deflate,sdch'
        }
    }

    var me = this;
    var callback = function(response) {
        var body = '';

        response.on('data', function(chunk) {
            body += chunk;
        })
        response.on('end', function() {
            me.detailResponse(body, response)
        });
    }

    http.request(options, callback).end();
}

ScriptTest.prototype.detailResponse = function(body, response) {
    response.lowerCaseHeaders = {};
    for (var header in response.headers) {
        response.lowerCaseHeaders[header.toLowerCase()] = response.headers[header].toLowerCase();
    }

    response.checkHeader = function(name, value) {
        return this.lowerCaseHeaders[name.toLowerCase()] === value.toLowerCase();
    }

    response.getHeader = function(name) {
        return this.lowerCaseHeaders[name.toLowerCase()]
    }

    // var s = new Sandbox()
    // s.run(body, function(output) {
    //  console.log(output);
    // })

    var results = {
        statusCode: response.statusCode,
        bodySize: body.length,
        gzip: response.checkHeader('Content-Encoding', 'gzip'),
        cacheControl: response.getHeader('cache-ConTrol'),
        cdn: checkCDN(response.getHeader('server'))
    }

    console.log(results);
}

function checkCDN(server) {
    var cdnList = ['amazons3', 'akamai', 'level3'];
    return cdnList.indexOf(server) > -1
}

function checkDocumentDotWrite(body) {
    if (body.indexOf('document.write(') > -1) {
        return 'definite';
    }
}

module.exports = {
    ScriptTest: ScriptTest
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
    }
}
