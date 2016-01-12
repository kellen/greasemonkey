// ==UserScript==
// @name           Youtube change links
// @namespace      http://userscripts.org/users/fake
// @include        /https?://(www.)?youtube.(se|com)/*/
// @require        http://zeptojs.com/zepto.min.js
// @grant		   none
// ==/UserScript==

Zepto(document).ready(function(){
    // change logo link to go to subscriptions instead of "what to watch"
    Zepto("#logo-container").attr("href", "/feed/subscriptions");
    
    // callback to change user links to go to videos instead of "home"
    var videocallback = function(){
        Zepto(this).attr("href", Zepto(this).attr("href") + "/videos");
    };
    // change menu links -> videos
    Zepto("li.guide-channel>a").each(videocallback);
    // change user links -> videos
    Zepto(".yt-user-info>a").each(videocallback);
});
