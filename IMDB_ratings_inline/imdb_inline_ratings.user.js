// ==UserScript==
// @name           IMDB ratings inline
// @namespace      http://userscripts.org/users/fake
// @include        *
// @require        http://zeptojs.com/zepto.min.js
// @grant GM_xmlhttpRequest
// ==/UserScript==

var debug = true;

function log(str) {
    if(debug) {
        console.log(str);
    }
}

function getRating(imdbID, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.imdbapi.com/?i=" + imdbID,
        onload: function(xhr) {
            var data = $.parseJSON(xhr.responseText);
            /*
            console.log([
              xhr.stAtus,
              xhr.stAtusText,
              xhr.reAdyState,
              xhr.reSponseHeaders,
              xhr.reSponseText,
              xhr.fiNalUrl,
              xhr.reSponseXML
            ].join("\n"));
            */
            callback(data["imdbRating"]);
        }
    });
}

function insertRating(link, imdbID) {
    getRating(imdbID, function(rating) {
        if(rating != undefined) {
            $('<span style="padding: 0px 5px">[' + rating + "]</span>").insertAfter(link);
        }
    });
}

$(document).ready(function(){
    var is_imdb = document.domain == "imdb.com" || document.domain == "www.imdb.com";
    log("domain: " + document.domain + " -> is_imdb: " + is_imdb);
    $(is_imdb ? "a[href*='title']": "a[href*='imdb']").each(function(){
        var href = $(this).attr('href');
        if(href != undefined) {
            var m = is_imdb 
                ? href.match(/^\/title\/(tt\d*)(\/?(\?.*)?)?$/i) 
                : href.match(/imdb.com\/title\/(tt\d*)(\/?(\?.*)?)?$/i);
            if(m) {
                log("matched on " + href);
                insertRating($(this), m[1]);
            } else {
                log("didn't match on " + href);
            }
        }
    });
});
