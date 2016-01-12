// ==UserScript==
// @name           nytimes adfree slideshows
// @namespace      http://userscripts.org/users/fake
// @include        http://*.nytimes.com/interactive*
// @include        http://nytimes.com/interactive*
// ==/UserScript==

var FOOBAR = function() {
// midstitial from NYTimes. Just a big copy with the ad code
// ripped out
//$Id: midstitial.js 52035 2010-12-03 12:05:02Z Madhan $


$ = unsafeWindow['window'].$;
/*
var keys = '';
for(var key in unsafeWindow['window']) {
	keys = keys + '\n' + key;
}
alert('keys: ' + keys);
*/
alert("$? " + $);

Element = unsafeWindow['window'].Element;
Effect = unsafeWindow['window'].Effect;
//alert(Element);

//var NYTD = window.NYTD || {};
var NYTD = {};

NYTD.MidstitialSlideshow = function(id, data) {
	alert('foo');
    var that = this;
    // lookup and save a reference to the container
    var container = $(id);
    if (!container || !data) {
        return;
    }
    // global slide width
    var slideWidth = 971;
    // save title
    var origTitle = document.title;
    // store the data locally
    var slideshowData = data;
    // store the ads locally
    var adData = null;
    // add 1 since the last slide isn't real?
    var totalSlides = slideshowData.slides.length;
    // first slide is "intro"
    var currentSlide = (slideshowData.showTitle ? 0 : 1);
    // calculate the midpoint to know where to draw the ad
    var midPoint = totalSlides % 2 == 0 ? (totalSlides / 2) + 1 : Math.ceil(totalSlides / 2);
    // so we don't re-add ads
    var initialAdInserted = false;
    var middleAdInserted = false;
    var viewingMiddleAd = false;
    var endAdInserted = false;
    // save reference to certain dom elements
    var headerBar = null;
    var prevButton = null;
    var pagination = null;
    var nextButton = null;
    var slideList = null;
    var relatedOverlay = null;
    var nextOverlay = null;
    var prevOverlay = null;
    var nextArrow = null;
    var prevArrow = null;

    // draw the "interface"
    (function() {
        // nav bar, initially invisible
        var headerWrapper = new Element('div', {id:"slideshowHeaderWrapper"});
        headerBar = new Element('div', {id:"slideshowInnerWrapper"});
        headerBar.style.display = "none";
        headerWrapper.insert(headerBar);
        var headerContent = new Element('div', {id:"slideshowHeader"});
        headerContent.innerHTML = "<h2>" + slideshowData.titleInfo.title + "</h2>";
        var buttonWrapper = new Element('div', {id:"slideshowControls"});
        prevButton = new Element('div', {id:"prevButton"});
        pagination = new Element('div', {id:"pagination"});
        pagination.innerHTML = "1 of " + (totalSlides + 1);
        nextButton = new Element('div', {id:"nextButton"});
        buttonWrapper.insert(prevButton);
        buttonWrapper.insert(pagination);
        buttonWrapper.insert(nextButton);
        headerContent.insert(buttonWrapper);
        headerBar.insert(headerContent);
        container.insert(headerWrapper);

        // viewport
        var viewport = new Element('div', {id:"viewport"});
        container.insert(viewport);

        // nav overlay items
        prevOverlay = new Element('div', {id: "prevOverlay"});
        prevOverlay.addClassName('navOverlay');
        prevOverlay.observe('click', function() { that.showPreviousSlide(); prevOverlay.blur(); });
        prevOverlay.observe('mouseover', function() { Effect.Appear(prevArrow, { duration:0.25 }); });
        prevOverlay.observe('mouseout', function() { Effect.Fade(prevArrow, { duration:0.25 }); });
        prevOverlay.hide();
        prevArrow   = new Element('div', {id: "prevArrow"});
        prevArrow.addClassName('arrow');
        prevArrow.insert("Prev");
        prevArrow.hide();

        nextOverlay = new Element('div', {id: "nextOverlay"});
        nextOverlay.addClassName('navOverlay');
        nextOverlay.observe('click', function(e) { that.showNextSlide(); nextOverlay.blur(); });
        nextOverlay.observe('mouseover', function() { Effect.Appear(nextArrow, { duration:0.25 }); });
        nextOverlay.observe('mouseout', function() { Effect.Fade(nextArrow, { duration:0.25 }); });
        nextOverlay.hide();
        nextArrow   = new Element('div', {id: "nextArrow"});
        nextArrow.addClassName('arrow');
        nextArrow.insert("Next");
        nextArrow.hide();

        viewport.insert(prevOverlay);
        viewport.insert(nextOverlay);
        viewport.insert(prevArrow);
        viewport.insert(nextArrow);

        // initially hide the prev button
        prevButton.addClassName('disabled');

        // slides list
        slideList = new Element('div', {id:"slideList"});
        slideList.style.display = "none";
        viewport.insert(slideList);

        // slides
        // first set up title page
        if (slideshowData.showTitle) {
            var listItem = new Element('div');
            listItem.addClassName('slideshowSlide');
            var introBoxDiv = new Element('div', {id:"introBox"});
            introBoxDiv.insert('<h3>'+slideshowData.titleInfo.title+'</h3><p>'+slideshowData.titleInfo.description+'</p>');
            var beginButton = new Element('a', {id:"startButton"});
            beginButton.insert('<img width="122" height="20" alt="Start Slideshow" src="/images/slideshow/temp/start_slideshow.gif"/>');
            introBoxDiv.insert(beginButton);
            listItem.insert(introBoxDiv);
            beginButton.observe('click', function () { that.showNextSlide();
                                                       showOverlays();
                                                       showNavHeader();
                                                       enableNextNavigationElements();
                                                       enablePrevNavigationElements(); });
            slideList.insert(listItem);
        }

        // rest of the image slides
        var maxHeight = 0;
        for (var i = 1; i <= totalSlides; ++i) {
            if (i === midPoint) {
                slideList.insert('<li class="middleAd" style="display:none;"></li>');
            }
            var cur = slideshowData.slides[i-1];
            if (cur.photo.height > maxHeight) { maxHeight = cur.photo.height; }
            listItem = new Element('div');
            listItem.addClassName('slideshowSlide');
            listItem.insert('<img width="'+cur.photo.width+'" height="'+cur.photo.height+'" src="'+cur.photo.url+'" />');
            var related = cur.relatedLink !== "" ? '<a class="related" href="'+cur.relatedLink+'">'+cur.relatedLinkText+'</a>' : "";
            listItem.insert('<div class="photoMeta" style="width:' + cur.photo.width + 'px"><div class="credit">'+cur.photo.credit+'</div><div class="caption">'+cur.photo.caption+'</div>'+related+'</div>');

            if (i === totalSlides) {
                // if this is the last slide, add related slideshow data
                relatedOverlay = new Element('div', {id:'relatedOverlay'});
                relatedOverlay.hide();
                // background
                relatedOverlay.insert('<div id="overlayBack"></div>');
                // left side
                var overlayLeft = new Element('div', {id:'overlayLeft'});
                var startOver = new Element('a', {href:"javascript:;"});
                startOver.addClassName('beginning');
                startOver.observe('click', function() { jumpToBeginning(); });
                startOver.insert("Back to Beginning");
                overlayLeft.insert(startOver);
                overlayLeft.insert('<h4>RELATED</h4>');
                var relatedList = new Element('ul');
                relatedList.addClassName('refer');
                for (var r=0, len = slideshowData.related.length; r < len; ++r) {
                    var curRel = slideshowData.related[r];
                    var relatedItem = new Element('li');
                    relatedItem.insert(curRel.type + ': <a href="' + curRel.link + '">' + curRel.text + '</a>');
                    relatedList.insert(relatedItem);
                }
                overlayLeft.insert(relatedList);
                relatedOverlay.insert(overlayLeft);
                // right side
                var overlayRight = new Element('div', {id:'overlayRight'});
                var closeButton = new Element('a', {href:'javascript:;'});
                closeButton.addClassName('close');
                closeButton.observe('click', function() { currentSlide--;
                                                          hideRelatedBox();
                                                          showOverlays();
                                                          enableNextNavigationElements();
                                                          updatePagination(); });
                closeButton.insert('Close');
                overlayRight.insert(closeButton);
                relatedOverlay.insert(overlayRight);

                listItem.insert(relatedOverlay);
            }

            slideList.insert(listItem);
        }

        // move the prev/next arrows
        var arrowPos = (maxHeight / 2) + 25 + "px";
        prevArrow.style.top = arrowPos;
        nextArrow.style.top = arrowPos;
    })();


    var hideRelatedBox = function() {
        relatedOverlay.hide();
    };

    var jumpToBeginning = function() {
        var start = 0;
        if (initialAdInserted) {
            start = -1 * slideWidth;
        }
        currentSlide = slideshowData.showTitle ? 0 : 1;
        if (slideshowData.showTitle) {
            hideNavHeader();
        }
        else {
            // if jumping to slide 1, track the view
            //trackSlide();
        }
        new Effect.Move(slideList, { x: start, mode: "absolute", duration:1, queue:"end" });

        hideRelatedBox();
        updatePagination();

        if (!slideshowData.showTitle) {
            showOverlays();
            disablePrevNavigationElements();
            enableNextNavigationElements();
        }
    };

    var moveNext = function() {
        new Effect.Move(slideList, { x: -1 * slideWidth, mode: "relative", duration:0.5, queue:"end" });
        //trackSlide();
    };
    var movePrev = function() {
        new Effect.Move(slideList, { x: slideWidth, mode: "relative", duration:0.5, queue:"end"  });
        //trackSlide();
    };

    // function to show the main slideshow description
    var showSlider = function () {
       slideList.style.display = "block";
    };

    // function to slide the next image data into view
    this.showNextSlide = function() {
        // update the slide number
        currentSlide++;
        updatePagination();

        // if there was no title and on second slide, enable previous
        if (!slideshowData.showTitle && currentSlide === 2) {
            enablePrevNavigationElements();
        }

        // are we at the end? show related box
        if (currentSlide === (totalSlides+1)) {
            disableNextNavigationElements();
            hideOverlays();
            //showRelatedBox(); 
            return;
        }

        // resize the overlays
        setPrevOverlayStyles();
        setNextOverlayStyles();

        // slide over
        moveNext();
    };

    // function to slide the previous image data into view
    this.showPreviousSlide = function() {
        // are we looking at the related box? hide it
        if (currentSlide === (totalSlides+1)) {
            currentSlide--;
            hideRelatedBox();
            showOverlays();
            enableNextNavigationElements();
            updatePagination();
            return;
        }

        // update the slide number
        if (!viewingMiddleAd) {
            currentSlide--;
            updatePagination();
        }

        // did we hit the ad spot?
        if (currentSlide === (midPoint - 1)) {
            if (viewingMiddleAd) {
                showOverlays();
                viewingMiddleAd = false;
            }
            else {
                if (middleAdInserted) {
                    hideOverlays();
                    viewingMiddleAd = true;
                    movePrev();
                    return;
                }
            }
        }

        // if there was a title, and we just moved to it, disable the nav elements
        if (slideshowData.showTitle) {
            if (currentSlide === 0) {
                disablePrevNavigationElements();
                hideOverlays();
                hideNavHeader();
                movePrev();
                return;
            }
        }
        else {
            // if there is no title and we are on slide 1, we kill the previous nav buttons
            if (currentSlide === 1) {
                disablePrevNavigationElements();
            }
        }

        // resize the overlays
        setPrevOverlayStyles();
        setNextOverlayStyles();

        // move over
        movePrev();
    };

    var updatePagination = function () {
        pagination.innerHTML = (currentSlide > 0 ? currentSlide : 1) + " of " + (totalSlides + 1); // +1 for related
        if (currentSlide === (totalSlides + 1)) {
            window.location.hash = "#" + totalSlides;
        }
        else if (currentSlide > 0 && currentSlide <= totalSlides) {
            window.location.hash = "#" + currentSlide;
        }
        else if (currentSlide === 0) {
            window.location.hash = "#1";
        }
        document.title = origTitle;
    };

    var showNavHeader = function() {
        Effect.Appear(headerBar);
    };
    var hideNavHeader = function() {
        Effect.BlindUp(headerBar,{duration:0.25, queue:"end"});
    };



    var setPrevOverlayStyles = function() {
        prevOverlay.style.height = slideshowData.slides[currentSlide - 1].photo.height + "px";
    };
    var setNextOverlayStyles = function() {
        nextOverlay.style.height = slideshowData.slides[currentSlide - 1].photo.height + "px";
    };

    var enablePrevNavigationElements = function() {
        prevButton.stopObserving('click');
        prevButton.removeClassName('disabled');
        prevButton.observe('click', function() { that.showPreviousSlide(); });
        setPrevOverlayStyles();
        prevOverlay.show();
    };
    var disablePrevNavigationElements = function() {
        prevButton.addClassName('disabled');
        prevButton.stopObserving('click');
        prevOverlay.hide();
    };
    var enableNextNavigationElements = function() {
        nextButton.stopObserving('click');
        nextButton.removeClassName('disabled');
        nextButton.observe('click', function() { that.showNextSlide(); });
        setNextOverlayStyles();
        nextOverlay.show();
    };
    var disableNextNavigationElements = function() {
        nextButton.addClassName('disabled');
        nextButton.stopObserving('click');
        nextOverlay.hide();
    };

    var hideOverlays = function() {
        nextOverlay.hide();
        prevOverlay.hide();
    };
    var showOverlays = function() {
        setPrevOverlayStyles();
        prevOverlay.show();
        setNextOverlayStyles();
        nextOverlay.show();
    };

	showSlider();
	if (!slideshowData.titleInfo.showTitle) {
	    showNavHeader();
	    showOverlays();
	    enableNextNavigationElements();
	    disablePrevNavigationElements();
	}

};

var children = $('container').childElements();
for (var i=0; i<children.length; i++) {
	children[i].remove();
}
NYTD.MidstitialSlideshow('container', unsafeWindow.chameleonData);
}


// stolen from jquery
if ( document.addEventListener ) {
    document.addEventListener( "DOMContentLoaded", function(){
	document.removeEventListener( "DOMContentLoaded", 
		arguments.callee, false );
                FOOBAR();
    }, false );
}
