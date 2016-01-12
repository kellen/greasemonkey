// ==UserScript==
// @name           Stackoverflow kill low scores
// @namespace      http://userscripts.org/users/fake
// @include		   http://stackoverflow.com/
// @include		   http://stackoverflow.com/questions
// @require        http://zeptojs.com/zepto.min.js
// @grant		   none
// ==/UserScript==

function log(str) {
	if(debug) {
		console.log("[SO HIDE] " + str);
	}
}

Zepto(document).ready(function(){
	var n = 0;
	Zepto("div.question-summary").each(function() {
		// hide based on low user score
		var s = Zepto(this).find('span.reputation-score').first().text();
		var hidden = false;
		if(!(s.contains(",") || s.contains("k") || s.contains("."))) {
			var num = parseInt(s);
			if(s < 300) {
				Zepto(this).hide();
				hidden = true;
				n = n + 1;
			}
		}
		// hide based on downvotes
		if(!hidden) {
			var v = Zepto(this).find('div.mini-counts>span').first().text();
			if(v.charAt(0) == "-") {
				Zepto(this).hide();
				hidden = true;
				n = n + 1;
			}
		}
	});
	log("Hid " + n + " posts.");
});
