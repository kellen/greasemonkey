// ==UserScript==
// @name           lexin accesskey
// @namespace      omgkellen
// @description    add accesskey to lexin box
// @include        http://lexin.nada.kth.se/cgi-bin/sve-eng
// ==/UserScript==

(function()
{
	// Give the edit box an id for the label to refer to
	document.forms[0].elements.namedItem("uppslagsord").setAttribute("id", "q");

	// Create the label
	var newLabel = document.createElement("label");
	newLabel.setAttribute("for", "q");
	newLabel.setAttribute("accessKey", "a");
	newLabel.setAttribute("title", "searchit");
	newLabel.value="OMGWORK";

	// Add the label to the form
	document.forms[0].appendChild(newLabel);

}) ();
