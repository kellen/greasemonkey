// ==UserScript==
// @name           banned-domains filter for metafilter
// @namespace      http://userscripts.org/users/fake
// @include        http://*.metafilter.com/
// @include        http://*.metafilter.com/index.cfm*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// ==/UserScript==

var DEBUG = true;

function log(msg) {
	if(DEBUG) console.log("[metafilter banned domains] " + msg);
}

log("Enabled.");
var domains = [
	"nytimes.com",
	"buzzfeed.com",
	];

$.noConflict();
jQuery(document).ready(function($){
		log("Filtering starting ... NOW!");
		var postcnt = 0;
		var removed = 0;
		$('div.post').each(function(){
			postcnt++;
			var matched = false;
			$(this).find('a').each(function(){
				for(var i = 0; i<domains.length; i++) {
					if($(this).attr("href").indexOf(domains[i]) != -1) {
						matched = true;
						return false;
					}
				}
			});
			if(matched) { 
				$(this).css("display", "none");
				if($(this).prev().is(".posttitle")) {
					$(this).prev().css("display", "none");
				}
				if($(this).next().is("br")) {
					$(this).next().css("display", "none");
				}
				removed++;
			}
		});
		log("Filtering tested " + postcnt + " posts, removed " + removed + ".");
});
