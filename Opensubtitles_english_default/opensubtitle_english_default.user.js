// ==UserScript==
// @name           Opensubtitles english default 
// @namespace      http://userscripts.org/users/fake
// @include        http://opensubtitles.org/*
// @include        http://*.opensubtitles.org/* 
// @grant	   none
// ==/UserScript==

function log(msg) { console.log("[opensub] " + msg); }

$(document).ready(function(){
	var engchecked = $("input[name='multiselect_SubLanguageID'][value='eng']");
	var allchecked = $("input[name='multiselect_SubLanguageID'][value='all']");
	log("checking " + engchecked.length + ", unchecking " + allchecked.length);
	engchecked.attr("checked", true);
	allchecked.attr("checked", false);
	});
