var http 	= require('http');
var url		= require('url');
var Sandbox = require('sandbox');
var Browser	= require('zombie');


function testBrowser() {
	var browser = new Browser();
	browser.visit("http://google.com", function () {

	  console.log(browser.text("title"));

	});
}

var testUrl = 'http://cdn.optimizely.com/js/10822091.js';


function makeRequest() {

	var parsedUrl = url.parse(testUrl);

	var options = {
		host: parsedUrl.host,
		path: parsedUrl.path,
		headers: {
			'Accept-Encoding': 'gzip,deflate,sdch'
		}
	}

	var callback = function(response) {
		var body = '';

		response.on('data', function(chunk) {
			body += chunk;
		})
		response.on('end', function() {
			detailResponse(body, response)
		});
	}

	http.request(options, callback).end();
}

function detailResponse(body, response) {
	console.log(response.headers);
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
	// 	console.log(output);
	// })

	var details = {
		statusCode: response.statusCode,
		bodySize: body.length,
		gzip: response.checkHeader('Content-Encoding', 'gzip'),
		cacheControl: response.getHeader('cache-ConTrol'),
		cdn: checkCDN(response.getHeader('server'))
	}
	//console.log(details);
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

//makeRequest();

module.exports = {
	makeRequest: makeRequest,
	testBrowser: testBrowser
}