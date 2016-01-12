// ==UserScript==
// @name           IMDB/blu-ray.com integration
// @namespace      http://userscripts.org/users/fake
// @include        /^https?://(www\.)?blu-ray\.com/movies/[^/]*/[0-9]*/?$/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

var debug = true;
var style = "font-size: 10px; font-family: Arial, sans-serif; text-decoration: none;";
var linktext = "TPB";

if(unsafeWindow.console){
   var GM_log = unsafeWindow.console.log;
}

function log(str) {
	if(debug) {
		GM_log("[bluray+piratebay] " + str);
	}
}


$(document).ready(function(){
		var h = $('h1[itemprop="itemReviewed"]>a');
		var l = true;
		log(window.location + ", itemReviewed>a size: " + h.length);
		if(h.length > 0) {
			h = h.first();
		} else {
			var h = $('h1[itemprop="itemReviewed"]');
			log(window.location + ", itemReviewed size: " + h.length);
			if(h.length > 0) h = h.first();
			l = false;
		}
		log(window.location + ", h is now size: " + h.length);

		var year = $('span.subheading>a[href*="movies.php?year="]');
		if(year.length > 0) year = year.first();
		year = year.text();
		//log(window.location + " year: " + year.text());

		h.each(function(){
			var title = $(this).text().replace(" Blu-ray", "");
			log("title: " + title);
			log("year: " + year);

			var pre = '<sup><a href="http://thepiratebay.se/search/';
			var post = '/0/7/0" style="' + style + '">' + linktext + '&nbsp</a></sup>';
			//var imdbpre = '<sup><a href="http://www.imdb.com/search/title?release_date=,';
			//var imdbmiddle = '&sort=year,desc&title=';
			//var imdbpost = '" style="' + style + '">IMDB&nbsp;</a></sup>';
			var imdbpre = '<sup><a href="http://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
			var imdbpost = '" style="' + style + '">IMDB&nbsp;</a>';

			var links = [
				//pre + title + post,
				pre + title + ' ' + year + post,
				//imdbpre + year + imdbmiddle + title + imdbpost
				imdbpre + title + ' ' + year + imdbpost
			];

			for(var i=0; i<links.length; i++) {
				if(l) {
					$(links[i]).insertAfter($(this));
				} else {
					$(links[i]).appendTo($(this));
				}
			}

			});
		});
