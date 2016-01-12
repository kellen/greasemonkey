// ==UserScript==
// @name           Metacritic pirate bay integration
// @namespace      http://userscripts.org/users/fake
// @include        http://www.metacritic.com/movie/* 
// @include        http://*.metacritic.com/movie/* 
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(document).ready(function(){
		var where = '#main div.product_title';
		var name = $(where).children(':first').text().trim();
		$('<a href="http://thepiratebay.org/search/ ' + name + ' /0/7/200">TPB</a>').appendTo(where);
		$('<a href="http://www.demonoid.me/files/?category=1&subcategory=0&language=0&quality=0&seeded=0&external=2&uid=0&sort=S&query=' + name + '">DMN</a>').appendTo(where);
		});
