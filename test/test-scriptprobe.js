var scriptprobe = require('../lib/scriptprobe');
var cdn			= require('../lib/cdn.js');

var test_urls = [
	"http://maxymiser.hs.llnwd.net/o36/guardian/js/mmcore.js",
	"http://ads.bluesq.com/ad.aspx?pid=5296&bid=2874",
	"http://cdn.optimizely.com/js/10822091.js"
]

// exports['calculate'] = function (test) {
//     test.equal(doubled.calculate(2), 4);
//     test.done();
// };

exports['test internal server'] = function(test) {
	var test = new scriptprobe.ScriptTest('http://maxymiser.hs.llnwd.net/o36/guardian/js/mmcore.js');
	test.startServer();
	test.done();
}