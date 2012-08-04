// Detect CDNs via hostname CNAMEs
// All matching done lowercase.

var dns = require('dns');

function isCdnHostname(hostname, callback) {
	dns.resolveCname(hostname, function(err, domains) {
		if (domains && domains.length > 0) {
			for (var i = 0, j = domains.length; i<j; ++i) {
				var domain = domains[i];
				for (var i = 0, j = hostnames.length; i<j; ++i) {
					if (domain.indexOf(hostnames[i]) > 0) {
						callback(true);
						return;
					}
				}
			}
		}
		callback(false);
	});
}

module.exports = {
	isCdnHostname: isCdnHostname
}

var hostnames = [
	'.akamai.net', 				//Akamai
	'.akamaiedge.net', 			//Akamai
	'.akamaihd.net',			//Akamai
	'.edgekey.net', 			//Akamai
	'.edgesuite.net', 			//Akamai
	'.llnwd.net', 				//Limelight
	'edgecastcdn.net', 			//Edgecast
	'hwcdn.net', 				//Highwinds
	'.panthercdn.com', 			//Panther
	'.simplecdn.net', 			//Simple CDN
	'.instacontent.net', 		//Mirror Image
	'.footprint.net', 			//Level 3
	'.ay1.b.yahoo.com', 		//Yahoo
	'.yimg.', 					//Yahoo
	'.google.', 				//Google
	'googlesyndication.', 		//Google
	'googleapis.l.google.com',	//Google
	'youtube.', 				//Google
	'.googleusercontent.com',	//Google
	'.internapcdn.net', 		//Internap
	'.cloudfront.net', 			//Amazon CloudFront
	'.netdna-cdn.com', 			//NetDNA
	'.netdna-ssl.com', 			//NetDNA
	'.netdna.com', 				//NetDNA
	'.cotcdn.net', 				//Cotendo CDN
	'.cachefly.net', 			//Cachefly
	'bo.lt', 					//BO.LT
	'.cloudflare.com', 			//Cloudflare
	'.afxcdn.net', 				//afxcdn.net
	'.lxdns.com', 				//lxdns.com
	'.att-dsa.net', 			//AT&T
	'.vo.msecnd.net', 			//Windows Azure
	'.voxcdn.net', 				//VoxCDN
	'.bluehatnetwork.com', 		//Blue Hat Network
	'.swiftcdn1.com', 			//SwiftCDN
	'.cdngc.net', 				//CDNetworks
	'.fastly.net', 				//Fastly
	'.gslb.taobao.com', 		//Taobao
	'.gslb.tbcache.com', 		//Alimama
	'.mirror-image.net', 		//Mirror Image
	'.yottaa.net', 				//Yottaa
	'.cubecdn.net',		 		//cubeCDN
	'.r.cdn77.net', 			//CDN77
	'.incapdns.net', 			//Incapsula
	'.bitgravity.com', 			//BitGravity
	'.r.worldcdn.net', 			//OnApp
	'.r.worldssl.net' 			//OnApp
];