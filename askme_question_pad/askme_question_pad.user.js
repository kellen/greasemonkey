// ==UserScript==
// @name           AskMe Question Pad
// @namespace      http://plutor.org/
// @description    Helps you keep track of questions you want to ask later
// @include        http://ask.metafilter.com/*
// ==/UserScript==
//
//

var useoradd = 'add';

//
// aqp_init()
//
function aqp_init() {
    var url = location.href;
    url = url.replace(/^http:\/\/[^\/]*/, '');

    if (url.indexOf('/contribute/post.cfm') == 0) {
        // Post form - show ideas under "Posting as"
        useoradd = 'use';
        var added = aqp_initpost();

        if (!added) {
            // Error page - show the add question to pad form
            useoradd = 'add';
            aqp_initpad();
        }

        aqp_refreshlist();
    }

    // Modify the "New question" link in the header to
    // show the number of questions on the pad
    aqp_updateheader();
}

//
// aqp_updateheader()
//
function aqp_updateheader() {
    var subheader = document.getElementById('navoften');
    if (!subheader) return;
    var subheads = subheader.childNodes;

    var questions = aqp_getsaved();

    for (var i=0; i<subheads.length; ++i) {
        var item = subheads[i];
        if (item.tagName != null && item.tagName.toLowerCase() == 'li' &&
            item.childNodes.length > 0) {
            var link = item.childNodes[0];
            if (link.tagName != null && link.tagName.toLowerCase() == 'a' &&
                link.href.match(/\/contribute\//)) {
                // This is the New Question link
                var text = link.innerHTML;
                text += " (" + questions.length + ")";
                link.innerHTML = text;
                break;
            }
        }
    }
}

//
// aqp_initpad()
//
// Shows the "add a question to your saved list" form somewhere in the
// error message.
//
function aqp_initpad() {
    // Serializing: text = object.toSource()

    var footer = document.getElementById('footer');
    if (!footer) return;

    var newtable = document.createElement('table');
    newtable.style.width = '90%';
    footer.parentNode.insertBefore(newtable, footer);

    var newrow = document.createElement('tr');
    newtable.appendChild(newrow);

    var labelcell = document.createElement('td');
    labelcell.innerHTML = 'Your saved questions:';
    labelcell.className = "copy";
    labelcell.vAlign = "top";
    labelcell.align = "right";
    newrow.appendChild(labelcell);
    
    var selectcell = document.createElement('td');
    selectcell.className = "copy";
    selectcell.vAlign = "top";
    selectcell.id = 'aqp_list';
    newrow.appendChild(selectcell);
}

function aqp_refreshlist() {
    var listdiv = document.getElementById('aqp_list');
    if (!listdiv) return;

    var padlist = document.createElement('ol');
    padlist.style.paddingLeft = '2em';
    var questions = aqp_getsaved();

    if (questions.length > 0) {
        for (var i=0; i<questions.length; ++i) {
            var padq = document.createElement('li');
            padq.style.paddingBottom = '0.1em';
            padq.innerHTML = questions[i];
            var padqsmall = document.createElement('span');
            padqsmall.className = "smallcopy";
            padq.appendChild(padqsmall);

            // use link
            if (useoradd == 'use') {
                padqsmall.appendChild(document.createTextNode(' ['));
                var uselink = document.createElement('a');
                uselink.id = 'aqp_uselink_' + i;
                uselink.innerHTML = 'use';
                uselink.href = '#';
                uselink.addEventListener('click', aqp_useques, false);
                padqsmall.appendChild(uselink);
                padqsmall.appendChild(document.createTextNode(']'));
            }

            // delete link
            padqsmall.appendChild(document.createTextNode(' ['));
            var dellink = document.createElement('a');
            dellink.id = 'aqp_dellink_' + i;
            dellink.innerHTML = 'x';
            dellink.href = '#';
            dellink.addEventListener('click', aqp_delques, false);
            padqsmall.appendChild(dellink);
            padqsmall.appendChild(document.createTextNode(']'));

            padlist.appendChild(padq);
        }
    } else {
        var padq = document.createElement('li');
        padq.style.listStyle = 'none';
        padq.innerHTML = '<i>You have no saved questions.</i>';
        padlist.appendChild(padq);
    }

    if (useoradd == 'add') {
        // Add prompt
        var padq = document.createElement('li');
        padq.style.listStyle = 'none';
        padq.style.paddingBottom = '0.1em';
        padq.innerHTML = '<label for="aqp_addprompt">Add:</label> ';
        padlist.appendChild(padq);

        var addprompt = document.createElement('input');
        addprompt.id = 'aqp_addprompt';
        addprompt.type = "text";
        addprompt.name = "aqp_addprompt";
        addprompt.style.width = '40em';
        addprompt.addEventListener('keydown', aqp_addques, false);
        padq.appendChild(addprompt);
        setTimeout(function(){ addprompt.focus() }, 50);
    }

    listdiv.innerHTML = '';
    listdiv.appendChild(padlist);
}

function aqp_delques(e) {
    var link = e.target;
    e.preventDefault();

    var index = link.id.replace(/.*_/, '');

    var questions = aqp_getsaved();
    if (questions.length < index) return;

    var deleted = questions.splice(index, 1);
    aqp_savequestions(questions);

    aqp_refreshlist();

    return (deleted.length ? deleted[0] : "");
}

function aqp_useques(e) {
    e.preventDefault();

    // Delete it
    var text = aqp_delques(e);

    var field = document.getElementById('comment'); // That's weird.
    field.value += text;
}

function aqp_addques(e) {
    // Save if the key was enter
    if ( !(e && e.keyCode && e.keyCode == 13) ) return;

    var questions = aqp_getsaved();
    var addprompt = document.getElementById('aqp_addprompt');
    var newques = addprompt.value;
    if (!newques || newques == "") return;

    questions.push( newques );
    aqp_savequestions(questions);

    aqp_refreshlist();
}

//
// aqp_initpost()
//
// Shows the saved questions somewhere in the new question form
//
function aqp_initpost() {
    var questions = aqp_getsaved();

    // 1) Find the form with action="post_preview.cfm"
    // 2) Find the table inside that form
    // 3) Find the second row inside that table
    var xpath = "//form[@action='post_preview.cfm']/table//tr[2]";

    var candidates = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var i = 0;

    for (var cand = null, i = 0; (cand = candidates.snapshotItem(i)); i++) {
        var newrow = document.createElement('tr');
        cand.parentNode.insertBefore(newrow, cand);

        var labelcell = document.createElement('td');
        labelcell.innerHTML = 'Your saved questions:';
        labelcell.className = "copy";
        labelcell.vAlign = "top";
        labelcell.align = "right";
        newrow.appendChild(labelcell);
        
        var selectcell = document.createElement('td');
        selectcell.className = "copy";
        selectcell.vAlign = "top";
        selectcell.id = 'aqp_list';
        newrow.appendChild(selectcell);
    }

    return i;
}

//
// aqp_numsaved()
//
function aqp_getsaved() {
    var rv;

    var none = new Array();
    var val = GM_getValue("savedquestions");
    var obj = eval(val);

    if (obj && obj.length && obj.length > 0) {
        rv = obj;
    } else {
        rv = none;
    }

    return rv;
}

function aqp_savequestions(ques) {
    var questionstxt = ques.toSource();
    GM_setValue("savedquestions", questionstxt);
}

//
// Run now
//
aqp_init();

