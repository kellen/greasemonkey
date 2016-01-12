// ==UserScript==
// @name           noads_blocket
// @namespace      www.edholm.com/grease
// @description    Remove ads from blocket.se
// @include        http://www.blocket.se/*
// @version        2010-03-12 12:50
// ==/UserScript==

/*  =====================================================================

    Copyright 2010  Jan Edholm

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    ===================================================================== */

function doIt() {
    var i, foo, regex1, regex2;

    // Remove named elements
    foo = document.getElementById('bannercont');
    if (foo) {
        foo.parentNode.removeChild(foo);
    }
    foo = document.getElementById('banner_list');
    if (foo) {
        foo.parentNode.removeChild(foo);
    }
    foo = document.getElementById('BannerContAdRight_li');
    if (foo) {
        foo.parentNode.removeChild(foo);
    }
    foo = document.getElementById('categories_container');
    if (foo) {
        foo.parentNode.removeChild(foo);
    }
    foo = document.getElementById('footer');
    if (foo) {
        foo.parentNode.removeChild(foo);
    }

    // Remove top banner div (subpages)
    foo = document.getElementsByTagName('DIV');
    regex1 = new RegExp("(^|\\s)banner_top(\\s|$)"); 
    regex2 = new RegExp("(^|\\s)banner_top_frame(\\s|$)"); 
    for (i = foo.length - 1; i >= 0; i--) {
        if (regex1.test(foo[i].className) && (regex2.test(foo[i].className))) {
            foo[i].parentNode.removeChild(foo[i]);
        }
    }

    // Remove right column ad (subpages only)
    foo = document.getElementsByTagName('TD');
    for (i=foo.length-1; i >= 0; i--) {
        if (foo[i].className == 'column_right')
        {
            foo[i].parentNode.removeChild(foo[i]);
        }
    }

    // Remove unwanted <BR>'s at the end of main div
    foo = document.getElementById('News');
    if (foo) {
        flag = false;
        for (i = 0; foo && i < 50; i++) { // Don't loop forever
            fo2 = foo.nextSibling;
            if (foo.tagName == "BR") {    // Don't remove first <BR> found
                if (flag) {
                    foo.parentNode.removeChild(foo);
                } else {
                    flag = true;
                }
            }
            foo = fo2;
        }

    }
}

// Do it!
doIt();

