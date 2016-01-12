// ==UserScript==
// @name           nytimes reg bypass
// @namespace      http://userscripts.org/users/fake
// @include        http://nytimes.com/*
// @include        http://www.nytimes.com/*
// @include        http://*.nytimes.com/*
// @include        https://nytimes.com/*
// @include        https://www.nytimes.com/*
// @include        https://*.nytimes.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==

// from the reddit nyt bypass, which looked like this:
// javascript:(function(){C=document.cookie.split(";%20");for(d="."+location.host;d;d=(""+d).substr(1).match(/\..*$/))for(sl=0;sl<2;++sl)for(p="/"+location.pathname;p;p=p.substring(0,p.lastIndexOf('/')))for(i%20in%20C)if(c=C[i]){document.cookie=c+";%20domain="+d.slice(sl)+";%20path="+p.slice(1)+"/"+";%20expires="+new%20Date((new%20Date).getTime()-1e11).toGMTString()};window.location.reload()})()

/*
if(unsafeWindow.console) {
	var GM_log = unsafeWindow.console.log;
}
*/
//unsafeWindow.dcsMultiTrack = function(){};
function log(msg) { console.log("[nyt reg bypass] " + msg);	}

$.urlParam = function(name){
      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (!results) { return 0; }
      return results[1] || 0;
}

log("Running reg bypass.");

$(document).ready(function(){
		//log("Ready.");
		//if($('div.myAccount').length || $('div#gatewayCreative').length) {
			log("Found overlay/login page. Trying to bypass...");
			// split the cookie key=value pairs
			C=document.cookie.split("; ");
			// prepend with a '.' to ease processing
			var d = "."+location.host;
			var match;
			var p;
			var setfor = [];
			// match on the '.' separated domain segments
			// FIXME this sets cookies for "com"
			while(d != undefined && (match = d.match(/\..*$/)) && match != null && match.length == 1) {
				// fetch the match and strip off the leading period
				d = match[0].substr(1);	
				// split the path up and assign a new cookie for each path bit
				p = "/" + location.pathname;
				while(p = p.substring(0, p.lastIndexOf('/'))) {
					// replace existing cookies
			       		for(i in C) {
			        		if(c = C[i]) {
							cookie = c+"; domain=" + d +"; path="+p.slice(1)+"/"+"; expires="+new Date((new Date).getTime()-1e11).toGMTString();
							setfor.push(cookie);
							document.cookie = cookie;

						}
					}
				}
			}
			log(setfor.join("\n"));
			//window.location = $.urlParam("URI");
			
			//window.location.reload();
		//}
	});
