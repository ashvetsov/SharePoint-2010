/* This code block fixes following issues:
 *
 *  I. Applying 'Markup Style' causes multiple empty divs to be added between each 
 *     element, this causes number of additional issues:
 *       1. Applying 'Style' or 'Markup Style' becomes too slow;
 *       2. Switching browser between Chrome and IE creates multiple empty lines.
 *
 */
ExecuteOrDelayUntilScriptLoaded(function () {
	// Array to store all created placeholders to be removed.
	var placeHolders;
	// Original createStyledElement() function reference.
	var baseCreateStyledElement = RTE.FontCommands.createStyledElement;

	/* Wrapper around original createStyledElement() funtion.
	 * Arguments:
	 *   i: tag to create
	 *   f: class to assign to this tag	
	 */
	RTE.FontCommands.createStyledElement = function(i, f) {
		placeHolders = [];

		baseCreateStyledElement(i, f);
		
	    $.each(placeHolders, function (i, v) {
			$(v).remove();
		});
		placeHolders = [];
	};

	RTE.RteUtility.$2p = function($p0, $p1) {
	    if (!$p0) {
	        return null;
	    }

	    var $v_0 = $p0;
	    while ($v_0 && RTE.RteUtility.$1a($v_0)) {
	        $v_0 = $v_0.parentNode;
	    }
	    if (!$v_0) {
	        return null;
	    }
	    if ($p1) {
	        if (RTE.RteUtility.isSafari()) {
	            var $v_5 = RTE.Selection.getSelection();
	            $v_5.clear();
	        }

	        var $v_1 = false;
	        var $v_2 = false;
	        var $v_3 = $v_0.childNodes;
	        var $v_4 = $v_3.length;
	        for (var $v_6 = 0; $v_6 < $v_4; $v_6++) {
	            var $v_7 = $v_3[$v_6];
	            var $v_8 = $v_7.tagName === 'BR';
	            if (RTE.RteUtility.$20($v_7) || $v_8) {
	                $v_2 = true;
	                if ($v_1) {
	                    break;
	                }
	            }
	            else {
	                $v_1 = true;
	                if ($v_2) {
	                    break;
	                }
	            }
	        }
	        if ($v_1 && $v_2 || RTE.Canvas.$V($v_0)) {
	            var $v_9 = new RTE.CanvasRange('div');
	            var $v_A = false;
	            var $v_B = new RTE.DOMTreePosition($v_0.firstChild, 0);
	            var $v_C = $v_B.$1;				            
	            while ($v_C !== $v_0) {
	                $v_C = $v_B.$1;
	                var $v_D = RTE.RteUtility.$20($v_C);
	                var $v_E = $v_C.tagName === 'BR';
	                var $v_F = $v_B.atEnd();
	                var $v_G = $v_B.atStart();
	                if (!$v_A && !$v_D) {
	                    SP.UI.UIUtility.insertBefore($v_9.$2_0, $v_C);
	                    $v_A = true;
	                }
	                var $v_H = $v_A && ($v_D || $v_E);
	                if ($v_H) {
	                    if ($v_F && !$v_G) {
	                        $v_C.appendChild($v_9.$3_0);
	                    }
	                    else {
	                        SP.UI.UIUtility.insertBefore($v_9.$3_0, $v_C);
	                    }
	                    $v_9.resetCacheRange();
	                    var $v_I = document.createElement('DIV');

	                    /* On this stage, RTE markers will be placed inside
	                     * newly created <div>, so we should save reference
	                     * to this <div> to remove it later.
	                     */
	                    placeHolders[placeHolders.length] = $v_I;

	                    $v_9.wrapRange($v_I);
	                    
	                    /* This statement determines if tag is empty and adds
	                     * &#160; to it, so any empty <div> becomes an empty
	                     * line. Just commenting it.
	                    
	                    if (RTE.RteUtility.$1g($v_I.innerHTML, false) === '') {
	                        $v_I.appendChild(RTE.RteUtility.createTextNode($v_I.ownerDocument, RTE.RteUtility.$3J_0));
	                    }
	                     */
	                    $v_A = false;
	                }
	                if ($v_D) {
	                    $v_B.setLocationAtEnd();
	                }
	                $v_B.moveToNextElement();
	                if ($v_H) {
	                    if ($v_E) {
	                        RTE.RteUtility.removeNodeAndKeepChildNodes($v_C);
	                    }
	                }
	            }
	            $v_9.dispose();
	            $v_0 = $p0;
	            while ($v_0 && RTE.RteUtility.$1a($v_0)) {
	                $v_0 = $v_0.parentNode;
	            }
	        }
	    }

	    if ($v_0.tagName === 'TR' && $v_0.parentNode && ($v_0.parentNode.tagName === 'TBODY' || $v_0.parentNode.tagName === 'THEAD' || $v_0.parentNode.tagName === 'TFOOT')) {
	        $v_0 = $v_0.parentNode;
	    }
	    if (($v_0.tagName === 'TBODY' || $v_0.tagName === 'THEAD' || $v_0.tagName === 'TFOOT') && $v_0.parentNode && $v_0.parentNode.tagName === 'TABLE') {
	        $v_0 = $v_0.parentNode;
	    }
	    
	    return $v_0;
	};
	
	RTE.FontCommands.$8I_0 = function(a, h, j, i) {
	    ULSNVe: ;

	    /* By default, any tag in selected range must be converted
	     * to new one (except tables, ol's, etc.), but this will
	     * also cause our empty <div> to be converted to new tag.
	     * So, we should just leave all empty <div> tags as-is.
	     */
	    if (a.tagName === "DIV" && $.trim(a.innerHTML) == '') {
	    	return a;
	    }
	    
	    var b = document.createElement(h);
	    b.className = i;
	    var c = a.tagName;
	    if (c === "TR" || c === "THEAD" || c === "TBODY" || c === "TFOOT")
	        a = RTE.RteUtility.$E(a, "TABLE");
	    var d = RTE.Cursor.get_range();
	    if (h.toUpperCase() === "HR") {
	        d.deleteContent();
	        d.insertNode(b);
	        d.moveAfterNode(b)
	    } else {
	        if (c === "H1" || c === "H2" || c === "H3" || c === "H4" || c === "H5" || c === "H6") {
	            var f = document.createElement("DIV");
	            a.parentNode.insertBefore(f, a);
	            f.appendChild(a);
	            a = f
	        }
	        var e = new RTE.CanvasRange("block");
	        e.moveToChildren(a);
	        var g = RTE.RemoveStyleOnSelectionProcessor.$1H;
	        g.setSettings(e);
	        g.process();
	        e.dispose();
	        if (RTE.Canvas.$V(a)) {
	            RTE.RteUtility.$1E(a, b);
	            a.appendChild(b)
	        } else if (a.tagName === "LI" || a.tagName === "TD" || a.tagName === "TH") {
	            RTE.RteUtility.$1E(a, b);
	            a.appendChild(b)
	        } else if (a.tagName === "UL" || a.tagName === "OL" || a.tagName === "MENU" || a.tagName === "DIR" || a.tagName === "TABLE") {
	            a.parentNode.insertBefore(b, a);
	            b.appendChild(a)
	        } else {
	            a.parentNode.insertBefore(b, a);
	            RTE.RteUtility.$1E(a, b);
	            RTE.RteUtility.$J(a)
	        }
	    }
	    return b
	};

}, 'sp.ui.rte.js');

/* This code block fixes following issues:
 *
 *  I. Page scrolls top after applying 'Markup Style'.
 *
 */
ExecuteOrDelayUntilScriptLoaded(function () {
	RTE.Cursor.select = function() {
	    ULSNVe: ;
	    RTE.Cursor.$2K = true;
	    var a = RTE.Cursor.get_range();
	    if (a.isValid()) {
	        RTE.Canvas.$K = RTE.Cursor.$Cu_0();
	        if (!RTE.Canvas.$K)
	            if (RTE.RteUtility.isInternetExplorer())
	                if (!a.isEmpty()) {
	                    var e = a.$1N(), f = RTE.Cursor.getSelectedImage();
	                    if (f)
	                        try {
	                            var g = document.body.createControlRange();
	                            g.add(f);
	                            g.select()
	                        } catch (i) {
	                            e.select()
	                        }
	                    else
	                        e.select()
	                } else {
	                    var b = document.createElement("SPAN");
	                    b.innerHTML = String.fromCharCode(8203);
	                    a.insertBefore(b);
	                    var c = document.createElement("SPAN");
	                    c.innerHTML = String.fromCharCode(8203);
	                    a.insertAfter(c);
	                    var j = a.$1N();
	                    j.select();
	                    b.parentNode.removeChild(b);
	                    c.parentNode.removeChild(c)
	                }
	            else {
	                if (RTE.RteUtility.isSafari()) {
	                    RTE.Cursor.$5o();
	                    if (a.isEmpty()) {
	                        RTE.Cursor.$3S_0 = RTE.RteUtility.createTextNode(a.$2_0.ownerDocument, RTE.RteUtility.$1L_0);
	                        a.insertBefore(RTE.Cursor.$3S_0)
	                    }
	                }
	                var k = a.parentElement(), h = RTE.Canvas.getEditableRegion(k);

	                /* Every non-IE browser forces to re-focus editable area 
	                 * after new style select. This causes document to scroll
	                 * top, even if we're currently somewhere in the button.

	                h && h.focus();

	                 */

	                var d = a.$1N();
	                (d.$8.startContainer !== d.$8.endContainer || !RTE.Canvas.$1O(d.$8.startContainer)) && d.select()
	            }
	        else {
	            var l = RTE.Selection.getSelection();
	            l.clear()
	        }
	    }
	    RTE.Cursor.$1I_0 = false;
	    RTE.Cursor.$2K = false
	};
    
    RTE.Selection.prototype.clear = function() {
        ULSNVe: ;
        if (this.$1c.empty && this.$1c.clear) {
            /* Originally, every browser that supports native DOM
             * function empty(): http://help.dottoro.com/ljehhofi.php
             * just calls area.empty(), but in case of IE, we should
             * use another function, clear() in case of broken area.
             */
            if (RTE.RteUtility.isInternetExplorer() && this.$1c.type.toString() == "None") {
            	this.$1c.clear();
            } else {
            	this.$1c.empty();
            }
        } else {
            this.$1c.removeAllRanges && this.$1c.removeAllRanges()
        }
    };

}, 'sp.ui.rte.js');
