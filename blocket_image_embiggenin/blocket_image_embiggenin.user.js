// ==UserScript==
// @name           blocket image embiggening
// @namespace      http://userscripts.org/users/fake
// @include        http://www.blocket.se/*
// ==/UserScript==
var str = '//img[contains(@src, "lithumbs")]';
var results=document.evaluate(str,
		document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var result=null, i=0; result=results.snapshotItem(i); i++) {
	result.src = result.src.replace('lithumbs', 'images');
	result.removeAttribute("width");
	result.removeAttribute("height");
}
