// ==UserScript==
// @name           Lauritz fix watchlist
// @namespace      http://userscripts.org/users/fake
// @include		   /https?://(www\.)?lauritz.com/.*/
// @require        http://zeptojs.com/zepto.min.js
// @grant		   none
// ==/UserScript==

function log(str) {
	if(debug) {
		console.log("[LAURITZ] " + str);
	}
}

Zepto(document).ready(function(){
	var itemid = Zepto("#ItemIdLabel").first().text();
	var link = Zepto("a#WatchItemLinkHyperLinkOn");
	if(link.length > 0) {
		link.show();
		link.attr('href', 'http://www.lauritz.com/Item/SetItemWatch.ashx?itemId=' + itemid);
	}
});
