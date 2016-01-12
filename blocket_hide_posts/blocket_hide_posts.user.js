// ==UserScript==
// @name           blocket hide posts
// @namespace      http://userscripts.org/users/fake
// @include        http://www.blocket.se/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

var varname = "KILL_BLOCKET";
if(unsafeWindow.console) {
	var GM_log = unsafeWindow.console.log;
}
function log(msg) {
	GM_log("[HIDEPOSTS] " + msg);
}
$(document).ready(function(){
	log("Running blocket hide posts...");
	// show all hide all buttons
	$('td#linkshelf_container').each(function() {
			var showall = $('<input id="showallbutton" type="button" value="Show all"/>').click(function(){
					$(this).hide();
					$('#hideallbutton').show();
					$('tr.hiddenpost').each(function(){
						$(this).next().show();
						$(this).hide();
						});
				});
			showall.appendTo($(this));
			var hideall = $('<input id="hideallbutton" type="button" value="Hide all"/>').click(function(){
				
				});	
			});

	// show a button on each detail page
	$("div.info_container").each(function() { 
		var match = match_link(window.location.pathname);
		if(match != undefined) {
			var hidebutton = make_button(match).attr('id', 'hidebutton').click(function(){
				$('#showbutton').show();
				$(this).hide();
				}).prependTo($(this));
			var showbutton = make_button(match, 'show').attr('id', 'showbutton').click(function() {
				$('#hidebutton').show();
				$(this).hide();
				}).prependTo($(this));
			link_in_cache(match) ? hidebutton.hide() : showbutton.hide();
		}
		});

	var itemcnt = 0;
	// show a button on each listing.
	$('a.item_link').each(function() {
			itemcnt++;
			// find the #####.htm bit
			var match = match_link($(this).attr('href'));
			if(match != undefined) {
				// when it's found, get the TD to insert into
				// and add a button there.
				var button = make_button(match);
				var html = $(this).html();
				button.click(function(){
					hide_row($(this).parent().parent(), match, html);
				});
				button.insertAfter($(this));
			}
		});
	if(itemcnt > 0) log("Made " + itemcnt + " remove buttons.");
	// hide the rows already in the cache.
	var kill_links_str = GM_getValue(varname);
	var hiddencnt = 0;
	if(kill_links_str != undefined) {
		var kill_links = kill_links_str.split(', ');
		$("a.item_link").each(function() {
				var match = match_link($(this).attr('href'));
				if(match != undefined) {
					for(i=0;i<kill_links.length; i++) {
						if(match == kill_links[i]) {
							hiddencnt++;
							hide_row($(this).parent().parent(), match, $(this).html());
							break;
						}
					}
				}
				});
	}
	if(hiddencnt > 0) log("Hid " + hiddencnt + " items.");

});
// make a "remove me" button
function make_button(match, action) {
	var show = action != undefined && action == 'show';
	var button = $('<a></a>').click(function(){
			show ? rm_url(match) : add_url(match);
		});
	make_image(show ? 
		"http://upload.wikimedia.org/wikipedia/commons/d/d6/Crystal_Clear_action_apply.png" :
		"http://upload.wikimedia.org/wikipedia/commons/5/52/Nuvola_apps_error.png"
		).appendTo(button);
	return button;
}
function make_image(url) {
	 return $('<img/>').attr("src", url).attr("width", "10").attr("height", "10").attr("alt", "hide");
}
// get the ID from the link
function match_link(link_text) {
	var match = undefined;
	var matches = link_text.match('[0-9]+.htm');
	if(matches != undefined) {
		match = matches[0];
	}
	return match;
}
function hide_row(row_to_hide, url, title) {
	var link = $('<a>' + title + '+</a>').click(function(){
		rm_url(url);
		$(this).parent().next().show();
		$(this).parent().remove();
	});
	var row = $('<div class="item_row hiddenpost"></div>')
		.css('background-color', '#FFFFCC')
		.css('text-align', 'right')
		.css('height', '1em')
		.css('font-size', '.75em')
		.css('padding', '0px');
	row.insertBefore(row_to_hide);
	row.append(link);
	row_to_hide.hide();
}

// add a link to the list
function add_url(linknum) {
	if(linknum != undefined) {
		var val = GM_getValue(varname);
		if(val != null && val != '') {
			val = val + ', ';
		}
		val = val + linknum;
		GM_setValue(varname, val);
	}
}

// rm a link from the list
function rm_url(linknum) {
	log("Removing " + linknum + "...");
	if(linknum != undefined) {
		var val = GM_getValue(varname);
		if(val != undefined && val != '') {
			var vals = val.split(', ');
			var newvals = '';
			for(i=0; i<vals.length; i++) {
				if(vals[i] != linknum) {
					newvals += newvals != '' ? ', ' : '';
					newvals += vals[i];
				}
			}
			GM_setValue(varname, newvals);
		}
	}
}
function link_in_cache(link) {
	if(link != undefined) {
		var val = GM_getValue(varname);
		if(val != undefined) {
			var vals = val.split(', ');
			for(i=0; i<vals.length; i++) {
				if(vals[i] == link) {
					return true;
				}	
			}
		}
	}
	return false;
}
