var scriptprobe = require('../lib/scriptprobe');
var cdn			= require('../lib/cdn.js');

var testUrls = [
	"http://maxymiser.hs.llnwd.net/o36/guardian/js/mmcore.js",
	"http://ads.bluesq.com/ad.aspx?pid=5296&bid=2874",
	"http://cdn.optimizely.com/js/10822091.js"
]

var testServer = null;
//testServer = 'scriptprobe-server-web.herokuapp.com';

// exports['calculate'] = function (test) {
//     test.equal(doubled.calculate(2), 4);
//     test.done();
// };

exports['test optimizely'] = function(test) {
	var testUrl = 'http://localhost:8888/optimizely.js';
	scriptprobe.testUrl(testUrl, testServer, function(r) {
		test.equal(r.documentDotWrite, false);
		test.equal(r.totalBytes, 240055);
		test.equal(r.totalHttpRequests, 1);
		test.equal(r.httpRequests[0].statusCode, 200);
		test.equal(r.httpRequests[0].bodySize, 240055);
		test.equal(r.httpRequests[0].url, testUrl);
		test.deepEqual(r.globalVars, [ 'optly', 'optimizely', 'optimizelyPreview' ])
		test.done();
	});
}

exports['test document.write called'] = function(test) {
	var testUrl = 'http://localhost:8888/documentDotWrite.js';
	scriptprobe.testUrl(testUrl, testServer, function(r) {
		test.equal(r.documentDotWrite, true);
		test.done();
	});
}

exports['test document.write not called'] = function(test) {
	var testUrl = 'http://localhost:8888/nothing.js';
	scriptprobe.testUrl(testUrl, testServer, function(r) {
		test.equal(r.documentDotWrite, false);
		test.done();
	});
}

exports['test additional scripts loaded'] = function(test) {
	var testUrl = 'http://localhost:8888/addedScripts.js';
	scriptprobe.testUrl(testUrl, testServer, function(r) {
		test.equal(r.additionalScripts, 1);
		test.equal(r.totalHttpRequests, 2);
		test.done();
	});
}

exports['test additional css loaded'] = function(test) {
	var testUrl = 'http://localhost:8888/addedCss.js';
	scriptprobe.testUrl(testUrl, testServer, function(r) {
		test.equal(r.additionalCss, 1);
		//test.equal(r.totalHttpRequests, 2);
		test.done();
	});
}
exports['test additional image loaded'] = function(test) {
	var testUrl = 'http://localhost:8888/addedImages.js';
	scriptprobe.testUrl(testUrl, testServer, function(r) {
		test.equal(r.additionalImages, 1);
		//test.equal(r.totalHttpRequests, 2);
		test.done();
	});
}

exports['test additional iframe loaded'] = function(test) {
	var testUrl = 'http://localhost:8888/addedIframe.js';
	scriptprobe.testUrl(testUrl, testServer, function(r) {
		test.equal(r.additionalIframes, 1);
		//test.equal(r.totalHttpRequests, 2);
		test.done();
	});
}

exports['test custom'] = function(test) {
	var testUrl = 'http://localhost:8888/custom.js';
	scriptprobe.testUrl(testUrl, testServer, function(r) {
		test.equal(r.documentDotWrite, true);
		test.equal(r.additionalScripts, 2);
		test.equal(r.totalHttpRequests, 3);
		test.equal(r.totalBytes, 284);

		test.done();
	});
}