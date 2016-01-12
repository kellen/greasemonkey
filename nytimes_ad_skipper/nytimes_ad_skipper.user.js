// ==UserScript==
// @name           nytimes ad skipper
// @namespace      http://userscripts.org/users/fake
// @include        http://nytimes.com/*
// @include        http://www.nytimes.com/*
// @include        http://*.nytimes.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js
// ==/UserScript==

$(document).ready(function(){
		var matches = document.title.match('NY Times Advertisement');
		if(matches != undefined) {
			var href = $('img[src*="/ads/interstitial/skip"]').parent().attr('href');
			if(href != undefined) {
				window.location = href;
			}
		}
		})
