// ==UserScript==
// @name           piratebay seed sort
// @namespace      http://userscripts.org/users/fake
// @include        http://*.thepiratebay.*/*
// @include        http://thepiratebay.*/*
// @require        http://zeptojs.com/zepto.min.js
// ==/UserScript==

Zepto(document).ready(function(){
		Zepto('input[name="orderby"]').val('7');
		GM_log(window.location.href);
		var checked = window.location.href.indexOf("/500", window.location.href.length - 4) !== -1;
		//Zepto('<label title="Porn" for="porn">&nbsp;<input id="porn" type="checkbox"' 
	//		+ (checked ? ' checked="checked"' : '')
	//		+ ' onclick="javascript:rmAll();" name="porn"/>&nbsp;Porn</label>').insertAfter('label[for="games"]');
		});
