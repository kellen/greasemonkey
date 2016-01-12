// ==UserScript==
// @name           swebank bostadskostnad preload
// @namespace      http://userscripts.org/users/fake
// @include        http://hemnet.se/beskrivning/*
// @include        http://*.hemnet.se/beskrivning/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(document).ready(function(){
	var anc = $('#beskrivning-knapp-bokalkyl');
	var popupurl = anc.attr('href');
	$.ajax({
		url: popupurl,
		success: function(data) {
			$("img[src*=swedbank]", data).each(function(){
				var txt = $(this).parent().parent().html();
				var patt=/(https%3A%2F%2Finternet\.swedbank\.se[^']*)'/
				var match = patt.exec(txt);
				// used to have this, but firefox barfed on the combination 
				//var swelink = decodeURIComponent(unescape(match[1]));
				var swelink = decodeURIComponent(match[1]);
				// fuck it, just make a new copy. it's easier. unbind() doesn't work.
				var newlink = $('<a href="' + swelink + '" id="beskrivning-knapp-bokalkyl" class="knapp stor-knapp bokalkylfonster-knapp"></a>');
				newlink.html(anc.html());
				newlink.click(function(event) { 
					window.open($(this).attr("href"), "FNARF", "scrollbars=1,menubar=1,location=1");
					return false;
					});
				newlink.insertBefore(anc);
				anc.remove();
			});
		 }
	});
});
