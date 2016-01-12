// ==UserScript==
// @name           darken site
// @namespace      http://userscripts.org/users/fake
// @include        *
// @require        http://zeptojs.com/zepto.min.js
// ==/UserScript==

var LogLevels = {
    FINEST: 1,
    FINER: 2,
    FINE: 3,
    INFO: 4,
    WARN: 5,
    ERROR: 6, 
    getLevel: function(value) {
        for( var prop in this ) {
            if( this.hasOwnProperty( prop ) ) {
                 if( this[ prop ] === value )
                     return prop;
            }
        }
    }
};

var LOGLEVEL = LogLevels.FINE; 

var MODIFY_DEFAULTS = true;
var MODIFY_STYLESHEETS = true;
var MODIFY_INLINE = true;
var MODIFY_OTHER = true;

function log(str, level) {
    if(undefined == level) {
        level = LogLevels.FINEST;
    }
    if(level >= LOGLEVEL) {
        console.log("[COLORS." + LogLevels.getLevel(level) + "] " + str);
    }
}

log("running.", LogLevels.INFO);

var keys_to_invert = [
    "backgroundColor", 
    "color", "textDecorationColor",
    "borderColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor",
    "columnRuleColor", 
    "outlineColor"
//     , 
//     "textShadowColor" // FIXME this one needs special parsing
]

var ignore = [
    "transparent"
];

var rgbMapping = {
    "black": "rgb(0, 0, 0)",
    "white": "rgb(255, 255, 255)",
    "yellow": "rgb(255, 255, 0)",
    "purple": "rgb(255, 0, 255)",
    "green": "rgb(0, 255, 0)",
    "red": "rgb(255, 0, 0)",
    "blue": "rgb(0, 0, 255)",
    "orange": "rgb(255, 255, 0)"
};

// http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    log("converting rgb(" + r + "," + g + "," + b + ") to HSV...");
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    if(max == min) {
        h = 0;
    } else if (max == r) {
        h = (g - b) + d * (g < b ? 6: 0); 
        h /= 6 * d;
    } else if (max == g) {
        h = (b - r) + d * 2; 
        h /= 6 * d;
    } else if (max == b) {
        h = (r - g) + d * 4; 
        h /= 6 * d;
    } else {
        log("OH FUCK, your math is all wrong.", LogLevels.ERROR);
    }
    
    var hsv = {
        h: h,
        s: s,
        v: v
    };
    log("converted rgb(" + r + "," + g + "," + b + ") to " + JSON.stringify(hsv));
    return hsv;
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbStyleStringToComponents(rgb) {
    if(rgb.startsWith("rgb(")) {
        var tmp = rgb.substring(4); // strip off "rgb("
        tmp = tmp.substring(0, tmp.length-1); // strip off trailing ")"
        var color = tmp.split(", ");
        var r = parseInt(color[0]);
        var g = parseInt(color[1]);
        var b = parseInt(color[2]);
        
        log("parsed " + rgb + " to (" + r + ", " + g + ", " + b + ")");
        return {
            r: r,
            g: g,
            b: b
        };
    } 
    log("failed to parse rgb string to components for [" + rgb + "] returning black.");
    return {r:0, g:0, b:0};
}

function darkenHSV(color) {
    return {
        h: color.h,
        s: color.s,
        v: color.v / 2
    }
}

function darkenColor(cur) {
    log("--------------------------------", LogLevels.FINER);
    log("darkening color " + cur, LogLevels.FINER);
    if(ignore.indexOf(cur) < 0) {
        if(rgbMapping.hasOwnProperty(cur)) {
            log("found named color [" + cur + "], converted to " + rgbMapping[cur], LogLevels.FINER);
            cur = rgbMapping[cur];
        }
        if(cur.startsWith("#")) {
            var tmp = hexToRgb(cur);
            var newcolor = "rgb(" + tmp.r + ", " + tmp.g + ", " + tmp.b + ")";
            log("found hexidecimal color [" + cur + "], converted to " + newcolor, LogLevels.FINER);
            cur = newcolor
        }
        if(cur.startsWith("rgb(")) {
            log("found rgb color [" + cur + "]", LogLevels.FINER)
            var tmp = rgbStyleStringToComponents(cur);
            var hsv = RGBtoHSV(tmp.r, tmp.g, tmp.b);
            var hsvdark = darkenHSV(hsv);
            var newcolor = HSVtoRGB(hsvdark); 
            log("converted " + JSON.stringify(hsvdark) + " to " + JSON.stringify(newcolor), LogLevels.FINER);
            var ret = "rgb(" + newcolor.r + ", " + newcolor.g + ", " + newcolor.b + ")";
            log("converted " + cur + " to " + ret, LogLevels.FINER)
            return ret;
        }
        log("found no replacement for [" + cur + "]", LogLevels.WARN);
    } else {
        log("skipping ignored color [" + cur + "]", LogLevels.INFO);
    }
    return cur;
}

function darkenKey(style, key) {
    if(undefined != style) {
        var cur = style[key];
        if(undefined != cur && "" != cur) {
            var newcolor = darkenColor(cur);
            if(undefined != newcolor && "" != newcolor && cur != newcolor) {
                style[key] = newcolor;
            }
        }
    }
}

function darkenAttribute(element, attr, value) {
    if(undefined != element && undefined != attr && undefined != value) {
        if("" != value) {
            var newcolor = darkenColor(value);
            if(undefined != newcolor && "" != newcolor && value != newcolor) {
                var parsed = rgbStyleStringToComponents(newcolor);
                var hex = rgbToHex(parsed.r, parsed.g, parsed.b);
                element.setAttribute(attr, hex);
            }
        } else {
            log("value empty, skipping", LogLevels.WARN);
        }
    } else {
        log("some element value undefined, skipping.", LogLevels.WARN);
    }
}

function darkenStyleSheets() {
    for(var sheet=0; sheet<document.styleSheets.length; sheet++) {
        log("darkening " + document.styleSheets[sheet].cssRules.length + " rules...", LogLevels.FINE);
        for(var rule=0; rule<document.styleSheets[sheet].cssRules.length; rule++) {
            log("rule " + rule + "...", LogLevels.FINE);
            if(undefined != document.styleSheets[sheet].cssRules[rule]) {
                var isBody = false;
                if(undefined != document.styleSheets[sheet].cssRules[rule].selectorText
                   && "body" == document.styleSheets[sheet].cssRules[rule].selectorText ) {
                    log("body", LogLevels.INFO);
                    isBody = true;
                }
                if(undefined != document.styleSheets[sheet].cssRules[rule].style) {
                    if(isBody) {
                        log(JSON.stringify(document.styleSheets[sheet].cssRules[rule].style), LogLevels.INFO);
                    }
                    for(var key=0; key<keys_to_invert.length; key++) {
                        darkenKey(document.styleSheets[sheet].cssRules[rule].style, keys_to_invert[key]);

                        //         log(
                        //             document.styleSheets[sheet].cssRules[rule].selectorText 
                        //             + "." + key
                        //             + ": " + cur
                        //             + " => " + document.styleSheets[sheet].cssRules[rule].style[key]
                        //         );
                    }
                } else {
                    log("skipping rule " + rule + " for selector text [" + document.styleSheets[sheet].cssRules[rule].selectorText + "] with undefined style.", LogLevels.WARN);
                }
            } else {
                log("skipping undefined rule " + rule, LogLevels.WARN);
            }
        }
        log("done darkening rules.", LogLevels.FINE);
    }
}

Zepto(document).ready(function(){
    log("replacing colors", LogLevels.INFO);
    
    if(MODIFY_STYLESHEETS) {
        log("darkening " + document.styleSheets.length + " stylesheets...", LogLevels.INFO);
        darkenStyleSheets();
        log("done darkening stylesheets.", LogLevels.INFO);
    } else {
        log("NOT darkening stylesheets.", LogLevels.INFO);
    }
    
    var items = document.getElementsByTagName("*");
    if(MODIFY_INLINE) {
        log("darkening inline styles", LogLevels.INFO);
        for (var i = 0; i < items.length; i++) {
            if(null != items[i].getAttribute("style")) {
                for(var key=0; key<keys_to_invert.length; key++) {
                   darkenKey(items[i].style, keys_to_invert[key]);
                }
            }
        }
        log("done darkening inline styles", LogLevels.INFO);
    } else {
        log("NOT darkening inline styles", LogLevels.INFO)
    }
    
    if(MODIFY_OTHER) {
        var darkenAttributes = ["bgcolor", "color"];
        log("darkening other attributes " + JSON.stringify(darkenAttributes), LogLevels.INFO);
        for(var attr=0; attr<darkenAttributes.length; attr++) {
            for (var i = 0; i < items.length; i++) {
                if(null != items[i].getAttribute(darkenAttributes[attr])) {
                    log(darkenAttributes[attr] + " : " + items[i].getAttribute(darkenAttributes[attr]))
                    darkenAttribute(items[i], darkenAttributes[attr], items[i].getAttribute(darkenAttributes[attr]));
                }
            }
        }
        log("done darkening other attributes.", LogLevels.INFO);
    } else {
        log("NOT darkening other attributes.", LogLevels.INFO);
    }
    
        
    var bodyBackground = document.body.style.backgroundColor;
    var bodyColor = document.body.style.color;
    
    if(MODIFY_DEFAULTS) {
        log("modifying default styles...", LogLevels.INFO);
        var defaultCss = [
            "body { background-color: black; color: rgb(200,200,200); }",
            "a:link { color: #FF9900}",
            "a:visited { color: #B44010}"
        ];
        
        if(document.styleSheets.length == 0) {
            // FIXME fake a stylesheet
        }
        if(document.styleSheets.length > 0) {
            for(var i = defaultCss.length-1; i>=0; i--) {
                document.styleSheets[0].insertRule(defaultCss[i], 0);
            }
        } else {
            log("found no stylesheet, cannot modify default styles", LogLevels.ERROR);
        }
        log("done modifying default styles.", LogLevels.INFO);
    } else {
        log("NOT modifying default styles.", LogLevels.INFO);
    }
    
    log("DONE!", LogLevels.INFO);
});