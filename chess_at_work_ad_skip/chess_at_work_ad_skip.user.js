// ==UserScript==
// @name           Chess at work ad skip
// @namespace      http://userscripts.org/users/fake
// @include        http://chessatwork.com/* 
// @include        http://*.chessatwork.com/* 
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(document).ready(function(){
		var matches = document.title.match('ChessAtWork.com : Subscriptions Advertisement.');
		if(matches != undefined) {
			var href = $('a:contains("Please click here to continue to your game."):first').attr('href');
			window.location = href;
		}
		});
