/**  Util.ts :  Contains Utility Functions needed by Client Applications. */

///<amd-dependency path="dojo/NodeList-manipulate" />

// Import Some Definition Files about ESRI and DOJO
/// <reference path="../definitions/esri.d.ts"/>
/// <reference path="../definitions/dojo/dojo.d.ts"/>

import dojoQuery = require("dojo/query");
import dojoAttr = require("dojo/dom-attr");
import on = require("dojo/on");

var _localeData = {};

// Special Key Codes, used For HotKeys function
var specialKeys= {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 188: ",", 190: ".",
			191: "/", 224: "meta"
		};

// Shift Nums, used For HotKeys function
var shiftNums= {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
			".": ">",  "/": "?",  "\\": "|"
		};



 /*
  * Helper Function for replacing the html or attributes of an HTML node, based on a data-i18n attribute;
  */
function _applyLocaleToNode(node: any, locale: string) {
    var changes = locale.split(";");
    for (var k = 0; k < changes.length; k++) {
        var thechange = changes[k];
        if (thechange.indexOf("[") > -1) {
            var tb = thechange.split("]");
            var myattr = tb[0].replace("[", "");
            if (myattr == "html") {
                var nl = new dojo.NodeList(node);
                nl.innerHTML(_getLocaleString(tb[1]));
            }
            else {
                dojoAttr.set(node,myattr, _getLocaleString(tb[1]));
            }
        }
        else {
            var nl = new dojo.NodeList(node);
            nl.text(_getLocaleString(thechange));
        }
    }
}


/*
 * Helper Function for getting a String from a Dojo i18n NLS resource
 */
function _getLocaleString(localdef: string): string {
    var bits = localdef.split(".");
    var root = _localeData;
    for (var b = 0; b < bits.length; b++) {
        if (root[bits[b]] == undefined) { return ""; }
        root = root[bits[b]];
    }
    return <any>root;
}

class Util {

    /*
     * Register a Dojo i18n NLS resource
     */
    public static registerLocaleResource(localeData, resourceName) {
        _localeData[resourceName] = localeData;
    }

    /*
     * Helper Function for getting a String from a Dojo i18n NLS resource
     */
    public static t(resourceName: string) {
        return _getLocaleString(resourceName);
    }

    /*
     * Helper Function for going through HTML elements using a selector, or a specific node, and substituting i18n resources
     */
    public static i18n(elements: string | HTMLElement): void {
        if (typeof elements === 'string') {
            dojoQuery(elements).forEach(function(node) {
                if (dojoAttr.get(node, "data-i18n")) {
                    _applyLocaleToNode(node, dojoAttr.get(node, "data-i18n"))
                }

                dojoQuery("[data-i18n]", node).forEach(function(repnode) {
                    if (dojoAttr.get(repnode, "data-i18n") ) {
                        _applyLocaleToNode(repnode, dojoAttr.get(repnode, "data-i18n"))
                    }
                });
            });
        }
        else {
            if (dojoAttr.get(elements, "data-i18n") ) {
                _applyLocaleToNode(elements, dojoAttr.get(elements, "data-i18n"))
            }

            dojoQuery("[data-i18n]", elements).forEach(function(repnode) {
                if (dojoAttr.get(repnode, "data-i18n")) {
                    _applyLocaleToNode(repnode, dojoAttr.get(repnode, "data-i18n"));
                }
            });
        }
    }
    
  
    
    
    /*
     * Logs a message with an optional error to the console
     */
    public static log(message, error?) {
        if ((error === undefined) || (error === null)) {
            console.log(message);
        }
        else {
            console.log(message + " - " + error.message);
            console.log(error.stack);
        }

    }

    /*
     * Logs an error message with an optional error object to the console
     */
    public static error(message, error?) {
        if ((error === undefined) || (error === null)) {
            console.log("ERROR: " + message);
        }
        else {
            console.log("ERROR: " + message + " - " + error.message);
            console.log(error.stack);
        }

    }

    /*
    * Logs a debug message with an optional error object to the console
    */
    public static debug(message, error?) {
        if ((error === undefined) || (error === null)) {
            console.log("DEBUG: " + message);
        }
        else {
            console.log("DEBUG: " + message + " - " + error.message);
            console.log(error.stack);
        }

    }


    /*
    * Logs an info message with an optional error object to the console
    */
    public static info(message, error?) {
        if ((error === undefined) || (error === null)) {
            console.log("INFO: " + message);
        }
        else {
            console.log("INFO: " + message + " - " + error.message);
            console.log(error.stack);
        }

    }


         

    /*
     *  Utility method for performing a multi replace in a string
     */
    public static multiReplace(str, match, repl) {
        if (match === repl)
            return str;
        do {
            str = str.replace(match, repl);
        } while (str.indexOf(match) !== -1);
        return str;
    }
    
     /*
     *  Pad a number with 0
     */
     public static padDigits(mynumber : number, digits: number) : string {
            return Array(Math.max(digits - String(mynumber).length + 1, 0)).join("0") + mynumber;
     }
     
     
      /*
     *  Hot Key Implementation copied from jqery.hotkeys
     */
     public static hotkey(selector: string, eventname: string, keycode, callfunction ) :any {
         keycode = keycode.toLowerCase();
         var d =  dojoQuery(selector).on(eventname, function(event: any) {
             if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				event.target.type === "text" || dojoAttr.get(event.target, 'contenteditable') == 'true' )) {
				return;
			}

			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt_";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl_";
			}

			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta_";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift_";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift_" ) {
					possible[ shiftNums[ character ] ] = true;
				}
			}
             
             for(var n in possible) {
                 console.log(n);
             }
             
             if (possible[keycode]) {
                 callfunction(event);
             }
             

         });
         return d;
     }

}

export = Util;