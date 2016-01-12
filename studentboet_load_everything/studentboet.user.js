// ==UserScript==
// @name           studentboet load everything.
// @namespace      http://userscripts.org/users/fake
// @include        http://portal.studentboet.se/en/plugins/bostadsmotorn/search-and-order/8/5/4
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// ==/UserScript==

// new_offset=1&new_sortby=updated_at&current_sortby=updated_at&current_order=asc

var debug = true;

if(unsafeWindow.console){
   var GM_log = unsafeWindow.console.log;
}

function log(str) {
	if(debug) {
		GM_log("[studentboet]" + str);
	}
}

function getPage(url, callback) {
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		onload: function(xhr) {
			callback(xhr.responseText);
		}
	});
}

function insertRating(link, imdbID) {
	getRating(imdbID, function(rating) {
			if(rating != undefined) {
				$('<span style="padding: 0px 5px">[' + rating + "]</span>").insertAfter(link);
			}
	});
}

$(document).ready(function(){
	var urlPatt = /load\("([^"]*)"\)/;
	$('tr.rental_row').each(function(){
		var currentrow = $(this);
		var onclick = currentrow.find('td').first().find('a').first().attr('onclick');
		var match = urlPatt.exec(onclick);
		if(match) {
			if(match[1]) {
				log("match: " + match[1]);
				getPage(match[1], function(data) {
					log("got callback.");
					log("currentrow: " + currentrow);
					log("cr.len: " + currentrow.length);
					var n = currentrow.next();
					n.show();
					n.css('background-color', 'red').css('border', '5px solid red');
					//log($(data).find('div.rental_details').html());
					var details = $(data).find('div.rental_details');
					details.find('.bostadsmotorn_rental_view_details')
						.css({
							'float': 'left',
							'margin-right': '30px',
							'width': '200px',
						});
					details.find('.bostadsmotorn_rental_view_contact')
						.css({
							"position": "absolute",
							"top": "0px",
							"right": "0px",
							"background-color": "#F6F6F6",
							"border": "1px solid #E9E9E9",
							"padding": "10px",
							"width": "250px"
							});
					n.children().first().append(details);
				});
			} else {
				log("didn't find regex in " + onclick);
			}
		} else {
			log("didn't match in: " + onclick);
		}
	});
});
