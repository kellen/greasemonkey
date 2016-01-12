// ==UserScript==
// @name           Youtube kill users from suggestions
// @namespace      http://userscripts.org/users/fake
// @include        /https?://(www.)?youtube.(se|com)/*/
// @require        http://zeptojs.com/zepto.min.js
// @grant		   none
// ==/UserScript==

var kill= ['watchmojo.com'];
var fuck = {};
for(var i=0; i< kill.length; i++) {
	fuck[kill[i].toUpperCase()] = true;
}

function log(str) {
	if(debug) {
		console.log("[DIEYOUTUBE] " + str);
	}
}

Zepto(document).ready(function(){
	Zepto("ul#watch-related b>span.g-hovercard").each(function() {
		if(Zepto(this).text().toUpperCase() in fuck) {
			log("killing " + Zepto(this).text().toUpperCase());
			Zepto(this).closest('.related-list-item').remove();
		}
	});
});
