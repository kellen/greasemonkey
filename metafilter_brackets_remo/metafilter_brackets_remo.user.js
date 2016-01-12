// ==UserScript==
// @name           Metafilter brackets remover
// @namespace      http://userscripts.org/users/fake
// @description    Removes brackets for meta shit on metafilter
// @include        http://metafilter.com/*
// @include        http://*.metafilter.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==
//

function mfc_init() {
    var url = location.href.toLowerCase();
    url = url.replace(/^https?:\/\/([^\/]*\.)?metafilter.com/, '');
    if (url.match(/^\/(\d+)/))
        mfc_init_thread();
}

function mfc_init_thread() {
   $("div.comments[id!=prevDiv][id!=prevDiv2] span.smallcopy:contains('posted by') span")
        .each( function(i) {
                $(this).html(
			$(this).html().replace("[", "").replace("]", "")
                );
	} );
}

mfc_init();

