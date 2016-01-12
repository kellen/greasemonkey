// ==UserScript==
// @name           Bypass YouTube age verification
// @namespace      delvin@userscripts.org
// @description    This script bypasses YouTube age verification without logging in.
// @author         Delvin
// @licence        GNU General Public License version 3 or any later version; http://www.gnu.org/licenses/gpl-3.0.html
// @copyright      2010 Delvin
// @homepage       http://userscripts.org/users/117689
// @version        1.2
// @include        http://youtube.com/verify_age*
// @include        http://www.youtube.com/verify_age*
// @include        https://youtube.com/verify_age*
// @include        https://www.youtube.com/verify_age*
// ==/UserScript==

if(unsafeWindow.console) {
	var GM_log = unsafeWindow.console.log;
}

if ( document.getElementById( "verify" ) ) {
 var url = decodeURIComponent( window.location.search.match( /[^?&]*next_url=([^&]*)/ )[1] );
	GM_log("Found verify, url:" + url);
 if ( url.match( "http://www.youtube.com/watch*" ) == null && url.match( "/watch*") == null) {
	GM_log("Null match, redirecting...");
  window.location.href = url;
 } else {
  GM_xmlhttpRequest({
   method: "GET",
   headers: {
    "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
   },
	url: url.substring(0, 7) == "http://" ? url : "http://www.youtube.com" + url,
	onload: function( response ) {
    if ( response.status == 200 ) {
     document.open( "text/html", "replace" );
     document.write( response.responseText );
     document.close();
    }
   }
  });
 }
}
