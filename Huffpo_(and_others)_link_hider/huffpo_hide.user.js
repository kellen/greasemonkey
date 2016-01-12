// ==UserScript==
// @name           Huffpo (and others) link hider
// @namespace      http://userscripts.org/users/fake
// @include        *
// @require        http://zeptojs.com/zepto.min.js
// @grant		   none
// ==/UserScript==

var fuck = {'HUFFPO': ["huffingtonpost.com"]};

function log(str) {
	if(debug) {
		console.log("[DIEHUFFPO] " + str);
	}
}

Zepto(document).ready(function(){
	for (var key in fuck) {
		for(var i=0; i < fuck[key].length; i++) {
			log(fuck[key][i]);
			Zepto("a[href*='" + fuck[key][i] + "']").each(function(){
				var title = Zepto(this).text();
				Zepto(this).replaceWith("<span class='diehuffpo' title='" + title + "'>[" + key + "]</span>");
			});
		}
	}
});
