// ==UserScript==
// @name           Hemnet prices
// @namespace      http://userscripts.org/users/fake
// @include        http://kartor.eniro.se/hemnet* 
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==
//

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}


function priceInfo() {
	var krtousd = .137773;
	var krvalues = [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 2, 3, 4, 5, 6, 7, 8];
	var nav = $('div.hemnetNav');
	var link = $('<a style="display:block; float:right;" id="pricezlink" href="">Show prices</a>');
	var tab = $('<div style="z-index:1000000;position:absolute; top:130px;right:10px;background-color:white;border:1px solid red;padding:10px;" id="pricez"><table id="priceztab"> <thead><tr><th>SEK</th><th>USD</th></tr></thead></table></div>');
	nav.append(link);
	nav.append(tab);
	for(key in krvalues) {
		$('<tr><td>' + addCommas(krvalues[key]*1000000) + '</td><td>' + addCommas(Math.round(krvalues[key]*1000 * krtousd)*1000) + '</td></tr>').appendTo('#priceztab');
	}
	$('#pricez').hide();
	$('#pricezlink').toggle(
		function() {
		$('#pricezlink').text('Hide prices');
		$('#pricez').show();
		},
		function() {
		$('#pricezlink').text('Show prices');
		$('#pricez').hide();
		}
	);
}

$(document).ready(function(){
	priceInfo();
	$('.hemnetPopup img').live('load', function() {$(this).css('border', '10px solid red');});
	//.each(function() {
	//	GM_log($(this).text);
	//	});
});
