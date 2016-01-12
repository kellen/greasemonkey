// ==UserScript==
// @name           nytimes multitrack fake
// @namespace      http://userscripts.org/users/fake
// @include        http://nytimes.com/*
// @include        http://www.nytimes.com/*
// @include        http://*.nytimes.com/*
// @include        https://nytimes.com/*
// @include        https://www.nytimes.com/*
// @include        https://*.nytimes.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==

// this fakes the multitrack script on nytimes so we can watch slideshows
unsafeWindow.dcsMultiTrack = function(){}
