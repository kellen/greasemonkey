// ==UserScript==
// @name           hide text nodes
// @namespace      http://userscripts.org/users/fake
// @include        *
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

var text_filter = function() { return this.nodeType == 3 && $(this).is(":empty"); }
var blank = function() { $(this).remove(); }
var kill = function() {
    $("body *").each(function(){
        $(this).contents().filter(text_filter).each(blank);
    });
}

$(document).ready(function(){ 
    var but = $('<input id="hideall" type="button" value="HIDETXT"/>').click(kill)
    		.css('position', 'absolute')
		.css('bottom', '0px')
		.css('right', '0px')
                .appendTo($("body"));
    });

