// ==UserScript==
// @name           ucsd libraries add PDF links 
// @namespace      http://userscripts.org/users/fake
// @include        https://libraries.ucsd.edu/apps/public/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// ==/UserScript==

$(document).ready(function(){
		$('body').each(function(){
			var href = document.URL;
			var m = href.match(/#ark:([^&]*)/);
			if(m) {
				$('<a ' + 
					'style="position: absolute; top: 3px; left: 0px;"' + 
					'href="' +
					'https://libraries.ucsd.edu/xdre/damsAccess?' +
					'ds=solr/dams4' +
					'&subject=' + m[1] +
					'&file=1-1.pdf' +
					'">PDF</a>').insertAfter($(this));
			}
		});
		});
