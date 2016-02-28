// ==UserScript==
// @name           Okcupid image embiggening
// @namespace      http://userscripts.org/users/fake
// @include        http://www.okcupid.com/profile/*
// @require        http://zeptojs.com/zepto.min.js
// @grant		       none
// ==/UserScript==

var debug = true;
var replace = new RegExp("images/[^/]*/[^/]*");
var dimre = new RegExp("(?:images/[^/]*/[^/]*/[^/]*/)([^x]*)x([^/]*)");

function log(str) {
	if(debug) {
		console.log("[OKC IMG] " + str);
	}
}

Zepto(document).ready(function(){
	log("RUNNING!");
	var id = "okc_img_gallery";
	Zepto('div.essays2015').after('<div id="' + id + '"></div>');
	var gal = Zepto('#' + id);
  var callback = function(){
		log("ok image!");
		var url = Zepto(this).attr('data-src');
		url = url.length > 0 ? url : Zepto(this).attr('src'); // fall back on data-src
    if(url.length == 0) return;
		
		log("found url: " + url);
		url = url.replace(/\/2\//, "/1/");
		/*
		var dim = dimre.exec(url);
		var x = dim[1];
		var y = dim[2];
		log("found dim: " + dim);
		*/
		//jurl = url.replace(replace, "images/160x160/" + dim);
		url = url.replace(replace, "images/160x160/1500x1500");
		log("new url: " + url);
		gal.append('<img src="' + url + '"><br>');
	};
	Zepto('.morePhotos2015-photos-photo img').each(callback);
	Zepto('.userinfo2015-thumb img').each(callback);
});
