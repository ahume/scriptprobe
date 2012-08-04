var cdn	= require('../lib/cdn.js');
var async = require('async');

var testPairs = {
	"static.guim.co.uk": true,
	"www.guardian.co.uk": false,
	"cdn.optimizely.com": true,
	"ads.bluesq.com": false,
	"maxymiser.hs.llnwd.net": false,
	"ajax.googleapis.com": true,
	"www.google-analytics.com": true,
	"ssl.google-analytics.com": true
}

exports['test domains'] = function (test) {

	var tests = [];
	for (var domain in testPairs) {
		tests.push(function(callback) {
			cdn.isCdnHostname(domain, function(isCdn) {
				test.equal(isCdn, testPairs[domain]);
				callback();
			});
		});
	}

	async.parallel(tests, function() {
		test.done();
	});
};