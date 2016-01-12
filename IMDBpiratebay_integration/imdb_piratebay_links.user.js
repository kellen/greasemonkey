// ==UserScript==
// @name           IMDB/piratebay integration
// @namespace      http://userscripts.org/users/fake
// @include        /^https?://(www\.)?imdb\.com/title/tt[0-9]*(/(\?.*)?)?$/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

var debug = true;
var style = "font-size: 10px; font-family: Arial, sans-serif; text-decoration: none;";
var linktext = "TPB";

function log(str) {
	if(debug) {
		console.log("[imdb+piratebay] " + str);
	}
}

$(document).ready(function(){
		var h = $('h1>span[itemprop]');
		log(window.location + ", size: " + h.length);
		h = h.first();
		log(window.location + ", size: " + h.length);
		h.each(function(){
			var $this = $(this);
			var next = $this.next();
			// just the normal title
			var title = $this.clone().children().remove().end().text().trim();
			log("title: " + title);
			// the normal title + the date
			var year = next.children().first().text().trim();
			log("w/ year: " + title + ' ' + year);
			// the alternate title
			//var alt = $this.find('span.title-extra');
			var alt = $this.next().next().next();
			var alttitle = alt.clone().children().remove().end().text().trim().replace(/"/g, "");
			log("alt: " + alttitle);

			var pre = '<sup><a href="http://thepiratebay.se/search/';
			var post = '/0/7/0" style="' + style + '">' + linktext + '</a></sup>';

			$(pre + title + post).insertBefore(next);
			$(pre + title + ' ' + year + post).appendTo(next);
			$(pre + alttitle + post).appendTo(alt);

			});
		});
