// ==UserScript==
// @name          guitar loading page
// @namespace     BEERBAJAY
// @include       http://www.ultimate-guitar.com/columns/fiction/riot_band_blues_part_1.html
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==

if(unsafeWindow.console){
   var GM_log = unsafeWindow.console.log;
}

$(document).ready(function(){
		var e = $('<body><div><p><a href="foo">bar</a></p><p>baz</p></div></body>');
		GM_log("e.len: " + e.length + " html: " + e.html());
		var p = e.find('p');
		GM_log("p.len: "  + p.length + " html: " + p.html());
		var b = e.find('body');
		GM_log("b.len: " + b.length + " html: " + b.html());
		/*
	var printUrl = "http://www.ultimate-guitar.com/print.php?what=article&id=";
	var printId = $('input[name="rowid"]').val();
	GM_log("printId: " + printId);
    $.ajax({
		url: printUrl + printId,
        async: false,
		dataType: "html",
        success: function(data) {
			$('body').empty().append(data);
			GM_log("BAR: " + $(data).find('html').length);
			/*
			$(data).each(function(){
				GM_log($(this).html());
				});
				*/
	/*
        }
    });
	*/
});
