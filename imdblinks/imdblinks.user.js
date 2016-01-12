// ==UserScript==
// @name          IMDb Links in Rogers Video Direct
// @namespace     http://stephen-cross.blogspot.com/
// @description	  Adds IMDb search links to film list
// @include       http://193.15.197.33/FMPro?*
// ==/UserScript==

(function()
{
	// construct the IMDb search url using the movie title
	function makeIMDbUrl(movietitle) {
		var imdburl = 'http://www.imdb.com/find?q='+ movietitle +';tt=on;nm=on;mx=20;';
		return imdburl;
	}

	// create a table row with the link, and set the style
	function makeIMDbLink(movietitle) {
		var container = document.createElement("td");
		container.innerHTML = '<a href="'+ makeIMDbUrl(movietitle) +' " target="IMDb">DB</a>';
		container.setAttribute('style', 'text-transform:none;font-weight:normal;');
		return container;
	}

	// insert the new link into the document
	function insertIMDbLinks() {
		//var title = getMovieTitle();
		var container = "";
		var target = "";
		//var title = "";
		var rowtop = "";
		var links = document.getElementsByTagName('a');
		for (i=0; i<links.length; i=i+2) {
			var title = links[i].firstChild.nodeValue;
			rowtop = links[i].parentNode.parentNode.parentNode;
			if (rowtop && rowtop.nodeName=='TR') {
				container = makeIMDbLink(title);
				rowtop.insertBefore(container, rowtop.firstChild);
			}
		}
	}

	insertIMDbLinks();
})();
