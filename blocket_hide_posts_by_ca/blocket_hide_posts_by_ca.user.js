// ==UserScript==
// @name           blocket hide posts by category
// @namespace      http://userscripts.org/users/fake
// @include        http://www.blocket.se/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

if(unsafeWindow.console) {
	var GM_log = unsafeWindow.console.log;
}
function log(msg) {
	GM_log("[HIDECATS] " + msg);
}

var varname = "KILL_BLOCKET_CATS";
var cache = undefined;
var titlestr = 'a[title^="Visa annonser i kategorin "]';

var check = "http://upload.wikimedia.org/wikipedia/commons/d/d6/Crystal_Clear_action_apply.png";
var cross = "http://upload.wikimedia.org/wikipedia/commons/5/52/Nuvola_apps_error.png";
var smallcheck = "http://www.fastdomain.com/media/shared/info/hosting_features/_fd/green-check.gif";
var smallcross = "http://www.gardencentredirect.co.uk/assets/images/left-menu/red-x-small.png";

// get the category cache in array form
function get_cat_cache() {
	// this only affects the single page load
	if(cache != undefined) {
		return cache;
	}
	cache = [];
	var val = GM_getValue(varname);
	if(val != undefined && val != '') {
		var vals = val.split(', ');
		for(i=0; i<vals.length; i++) {
			cache.push(vals[i]);
		}
	}
	return cache;
}

// is the current category in the cache?
function cat_in_cache(cat) {
	if(cat != undefined) {
		var vals = get_cat_cache();
		for(var i=0; i<vals.length; i++) {
			if(vals[i] == cat) {
				return true;
			}	
		}
	}
	return false;
}

// do callback for the categories matching vals.
function for_matching_cats(vals, callback) {
	$(titlestr).each(function() {
		if(vals != undefined) {
			for(var i=0; i<vals.length; i++) {
				if(vals[i] == $(this).html()) {
					callback($(this).parent().parent().parent());
				}	
			}
		}
	});
}

// callback to show  the node
var show_cat = function(node) { node.show(); };
// callback hide the node
var hide_cat = function(node) { node.hide(); node.addClass('hiddencat'); };

// show a listing of the categories with toggles
function show_cat_menu() {
	$('div.linkshelf').each(function(){
		var banned = $('<div class="banned_cats"></div>').insertAfter($(this));
		$('<span><b>Banned</b></span>')
			.css('margin-right', '10px')
			.appendTo(banned);
		var vals = get_cat_cache();
		for(var i=0; i<vals.length; i++) {
			$('<a>' + vals[i] + '</a>').toggle(
					function() {
						for_matching_cats([$(this).html()], show_cat);
						unban_cat($(this).html());
						$(this).css('background-image', 'url("' + smallcross + '")');
					},
					function() {
						for_matching_cats([$(this).html()], hide_cat);
						ban_cat($(this).html());
						$(this).css('background-image', 'url("' + smallcheck + '")');
					}
				)
				.css('display', 'inline-block')
				.css('padding', '3px')
				.css('padding-left', '20px')
				.css('margin', '3px')
				.css('margin-right', '5px')
				.css('border', '2px solid #CCCCCC')
				.css('background-color', '#EEEEEE')
				.css('background-image', 'url("' + smallcheck + '")')
				.css('background-position', '0px 3px')
				.css('background-repeat', 'no-repeat')
				.appendTo(banned);
		}
	});
}

// add the category to the banned list
function ban_cat(cat) {
	if(cat != undefined) {
		cache = undefined;
		var vals = get_cat_cache();
		var found = false;
		for(var i=0; i<vals.length; i++) {
			if(vals[i] == cat) {
				found = true;
			}

		}
		if(!found) {
			var val = GM_getValue(varname);
			if(val != null && val != '') {
				val = val + ', ';
			}
			val = val + cat;
			GM_setValue(varname, val);
		}
	}
}
// remove the category from the banned list
function unban_cat(cat) {
	if(cat != undefined) {
		cache = undefined;
		var vals = get_cat_cache();
		var newvals = '';
		for(var i=0; i<vals.length; i++) {
			if(vals[i] != cat) {
				newvals += newvals != '' ? ', ' : '';
				newvals += vals[i];
			}
		}
		GM_setValue(varname, newvals);
	}
}

$(document).ready(function(){
		log("Running hide categories...");
		// hide the rows for the matching categories
		for_matching_cats(get_cat_cache(), hide_cat);
		// add buttons to ban a category
		$('<a><img src="' + smallcross + '"/></a>').click(function() {
			ban_cat($(this).prev().html());
			for_matching_cats([$(this).prev().html()], hide_cat);
			}).insertAfter(titlestr);
		// add buttons to toggle viewing of already-banned categories
		show_cat_menu();
		// add a button to show all hidden categories
		$('div.linkshelf').each(function(){
			log("linkshelf");
			$('<div></div>').append(
				$('<input id="showcatsbutton" type="button" value="Show categories"/>').toggle(
					function() {
						$(this).attr("value", "Hide categories");
						$('.hiddencat').show();
					},
					function() {
						$(this).attr("value", "Show categories");
						$('.hiddencat').hide();
					})
			).insertAfter($(this));
		});
	});
