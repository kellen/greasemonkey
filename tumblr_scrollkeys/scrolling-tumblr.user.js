// ==UserScript==
// @name          tumblr scrollkeys
// @namespace     http://userscripts.org/users/fake
// @include       http://www.androgynousgirls.com/*
// @include       http://androgynousgirls.com/*
// @include		  http://*.tumblr.com
// @include		  http://*.tumblr.com/
// @include		  http://tumblr.com/*
// @include		  http://*.tumblr.com/*
// @require		  https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require		  http://flesler-plugins.googlecode.com/files/jquery.scrollTo-1.4.2-min.js
// ==/UserScript==


// CONFIG
var DEBUG = true;
var REDIR_BYTEXT = false;
var REDIR_BYTEXT_NEXT = "Next →";
var REDIR_BYTEXT_PREV = "← Previous";
var REDIR_BYPAGE = true;
var REDIR_BYPAGE_URLPREFIX = "/page/";

// SCRIPT

function log(msg) {
	if(DEBUG) console.log("[tumblr-scroll] " + msg);
}
log('Running!');

$.noConflict();
jQuery( document ).ready(function($) {
	jQuery.fn.reverse = function() {
		return this.pushStack(this.get().reverse(), arguments);
	};

	function redirByText(text) {
		log("Searching for links with text " + text);
		$('a:contains("' + text + '")').each(function(){
			//alert('redirecting to ' + $(this).attr('href'));
				log("Found! Redirecting...");
			window.location = $(this).attr('href');
			return false;
		});
	}
	function redirByPage(down) {
		var p = window.location.href.search(REDIR_BYPAGE_URLPREFIX);
		var pnum = 2;
		var url = window.location.href;
		if(p != -1) {
			url = window.location.href.substring(0, p);
			pnum = parseInt(window.location.href.substring(p + REDIR_BYPAGE_URLPREFIX.length), 10) + (down ? 1 : - 1);
		} else if (!down) {
			return;
		}
		window.location = url + (/\/$/.test(url) ? "" : "/") + REDIR_BYPAGE_URLPREFIX.substring(1) + pnum;
	}

	function scrollToImg(down) {
		log("Trying to scroll " + (down ? "down" : "up") + "!");
		var scrollTop = $(window).scrollTop(); 
		log("Got scrollTop: " + scrollTop);
		var scrollBottom = scrollTop + $(window).height();
		log("Got scrollBottom: " + scrollBottom);
		var redired = false;
		if(down && scrollBottom == $(document).height()) {
			log("Already at bottom of document; not scrolling.");
			return redired;
		}
		var nodes = $('img').filter(function() {
					return $(this).attr('src').match('http:\/\/([0-9]+\.)?media.tumblr\.com\/.*') != null;
				});
		log("Found " + nodes.length + " images.");
		if(!down) {
			nodes = nodes.reverse();
		}
		nodes.each(function(i, img) {
			var imgtop = $(img).offset().top
			if((!down && scrollTop > imgtop) || (down && scrollTop+1 < imgtop )) {
				log("Scrolling to " + imgtop);
				$.scrollTo(img, 100);
				redired = true;
				return false; // exit
			}
		});
		log("Scrolled?" + redired);
		return redired;
	}

		$(document).bind('keydown',function(e) {
			var redired = false;
			if(e.which == 74) {		// j
				log("DOWN!");
				redired = scrollToImg(true);
				if(!redired) {
					if(REDIR_BYTEXT) redirByText(REDIR_BYTEXT_NEXT);
					else if(REDIR_BYPAGE) redirByPage(true);
				}
			} else if (e.which == 75) {	// k
				log("UP!");
				redired = scrollToImg(false);
				if(!redired) {
					if(REDIR_BYTEXT) redirByText(REDIR_BYTEXT_PREV);
					else if(REDIR_BYPAGE) redirByPage(false);
				}
			}
			});	
		log("Ready!");
	});
