// ==UserScript==
// @name           metropol image embiggen
// @namespace      http://userscripts.org/users/fake
// @include        http://www.metropol.se/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js
// ==/UserScript==

$(document).ready(function(){
		GM_log("READY");
		var imgurl = "http://" + location.host + "/imagebank/thumbs/1001/";
		$('img[src^="' + imgurl + '"]')
		/*
		.mouseover(function() {
			var im = $('<img id="previewim" src="' + $(this).attr('src') + '"/>');
			im.insertBefore($(this));
			var w = ($(window).width() - im.width())/2;
			var h = ($(window).height() - im.height())/2;
			var imgtop = $(window).scrollTop() + (h > 0 ? h : 0);
			var imgleft = w > 0 ? w : 0;
			im.css('z-index', '10000').css('position', 'absolute').css('top', imgtop + 'px').css('left', imgleft + 'px');
		})
		*/
		.each(function() {
			GM_log($(this).attr('src'));
			var src = $(this).attr('src');
			$(this).attr('src', src.replace("thumbs", "larges")).css('width', '300px');
			$(this).parent().mouseleave(function() {
				$('#previewim').remove();
			});
		});
	});
