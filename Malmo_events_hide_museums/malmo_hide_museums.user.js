// ==UserScript==
// @name           Malmo events hide museums
// @namespace      http://userscripts.org/users/fake
// @include        /^https?://evenemang\.malmo\.se/sv/evenemang.*$/
// @require        http://zeptojs.com/zepto.min.js
// @grant		   none
// ==/UserScript==

var debug = true;
var kill= ['Malmö Museer', "Malmö Konstmuseum", "Form/Design Center", "Moderna Museet", "Malmö Centralstation"];
var fuck = {};
for(var i=0; i<kill.length; i++) { 
    fuck[kill[i].toUpperCase()] = true;
}

function log(str) { 
    if(debug) {
        console.log("[DIEMUSEUMS] " + str); 
    }
}

Zepto(document).ready(function(){
    log("Running museum-removing.");
    var events = Zepto("div.vevent");
    log("Found " + events.length + " events");
  
    var toremove = events.filter(function(index) {
        return Zepto(this).find("div.cb_prod_arena_cat a")
                          .filter(function(index){
                              return Zepto(this).text().toUpperCase() in fuck;
                          }).length > 0;
    });
    log("Found " + toremove.length + " events to remove");
    toremove.each(function(){
      //Zepto(this).css("border", "10px solid red !important");
      Zepto(this).prev().hide();
      Zepto(this).hide();
    });
});
