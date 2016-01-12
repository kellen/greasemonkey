// ==UserScript==
// @name           quotefixer
// @namespace      http://userscripts.org/users/fake
// @include        http://www.secularhumanism.org/library/fi/mcelroy_17_4.html 
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

var count = 0;
var text_filter = function() { if(this.nodeType == 3) { count++; return true; } return false ;
//	&& $(this).is(":empty"); 
}

$(document).ready(function(){
		GM_log('started');
		/*
    $("body *").each(function(){
        $(this).contents().filter(text_filter).each(function(){
		$(this).text($(this).text().replace("’", "'").replace("“", '"').replace("”", '"'));
		});
    });
    */
	$('p.MsoNormal').each(function() {
		count++;
		$(this).text($(this).text().replace("’", "'").replace("“", '"').replace("”", '"'));
		});
GM_log('done');
    GM_log("count: " + count);
});
