// ==UserScript==
// @name           Disable adblock layer hider
// @namespace      http://userscripts.org/users/fake
// @include        *
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant		   none
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// ensure no double quotes inside the string, OR fix the contains() below
var strs = ["AdBlock detected.", "please disable the ad blocker", "please disable your ad blocker"];

var debug = true;
function log(str) {
	if(debug) {
		console.log("[BLOCKADBLOCK] " + str);
	}
}

//setTimeout(function (){
	$(document).ready(function(){
		for(var i=0; i<strs.length; i++) {
			$('body>*:contains(' + strs[i] + ')').each(function() {
				$(this).remove();
			});
			/*
			log("Finding text: [" + strs[i] + "]");
			var cnt=0;
			$('body>*').each(function() {
				log("dur");
				var found = $(this).find('*:contains(' + strs[i] + ')');
					log("Found " + found.length + "...");
				if(found.length > 0) {
					$(this).remove();
					cnt++;
				}
			});
			log("Removed: [" + cnt + "]");
			*/

			/*
			var found = $('body>* *:contains(' + strs[i] + ')');
			log("Found " + found.length + ", removing...");
			found.each(function() {
				$(this).parent().next().remove();
				$(this).parent().remove();
			});
			*/
		}
		setTimeout(function() {
			for(var i=0; i<strs.length; i++) {
				var cnt = 0;
				$('body>*').each(function() {
					var found = $(this).find('*:contains(' + strs[i] + ')');
					if(found.length > 0) {
						log($(this).html());
					}
					if(found.length > 0) {
						$(this).remove();
						cnt++;
					}
				});
			}
		}, 3000);
	});
//}, 50);
