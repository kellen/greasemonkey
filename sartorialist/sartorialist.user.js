// ==UserScript==
// @name          sartorialist
// @namespace     USH
// @include       http://thesartorialist.com/*
// @include       http://www.thesartorialist.com/*
// @require		  https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require		  http://flesler-plugins.googlecode.com/files/jquery.scrollTo-1.4.2-min.js
// ==/UserScript==

var DEBUG = false;
if(unsafeWindow.console) {
	var GM_log = unsafeWindow.console.log;
}
function log(msg) {
	GM_log("[sartorialist] " + msg);
}
log('Running!');

jQuery.fn.reverse = function() {
  return this.pushStack(this.get().reverse(), arguments);
};

function redirByText(text) {
	if(DEBUG) log("Searching for links with text " + text);
	$('a:contains("' + text + '")').each(function(){
		//alert('redirecting to ' + $(this).attr('href'));
	    if(DEBUG) log("Found! Redirecting...");
		window.location = $(this).attr('href');
		return false;
	});
}

function scrollToImg(down) {
	if(DEBUG) log("Trying to scroll " + (down ? "down" : "up") + "!");
	var scrollTop = $(window).scrollTop(); 
	if(DEBUG) log("Got scrollTop: " + scrollTop);
	var scrollBottom = scrollTop + $(window).height();
	if(DEBUG) log("Got scrollBottom: " + scrollBottom);
	var redired = false;
	if(down && scrollBottom == $(document).height()) {
		if(DEBUG) log("Already at bottom of document; not scrolling.");
		return redired;
	}
	var nodes = $('#content div.article-content img');
	if(DEBUG) log("Found " + nodes.length + " images.");
	if(!down) {
		nodes = nodes.reverse();
	}
	nodes.each(function(i, img) {
		var imgtop = $(img).offset().top
		if((!down && scrollTop > imgtop) || (down && scrollTop+1 < imgtop )) {
			if(DEBUG) log("Scrolling to " + imgtop);
			$.scrollTo(img, 100);
			redired = true;
			return false; // exit
		}
	});
	if(DEBUG) log("Scrolled?" + redired);
	return redired;
}

$(document).ready(function(){
		$(document).bind('keydown',function(e) {
			var redired = false;
			if(e.which == 74) {		// j
				if(DEBUG) log("DOWN!");
				redired = scrollToImg(true);
				if(!redired) {redirByText('Older Entries');}
			} else if (e.which == 75) {	// k
				if(DEBUG) log("UP!");
				redired = scrollToImg(false);
				if(!redired) {redirByText('Newer Entries');}
			}
			});	
		log("Ready!");
	});
