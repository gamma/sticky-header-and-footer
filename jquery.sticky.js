/* ************************************************************************
    Sticky Definitions
    Author: Gerry Weißbach
    GitHub: https://github.com/gamma/sticky-header-and-footer
************************************************************************ */
(function($){
   
    /* This is intended to smooth out resizing events */
    var waitForFinalEvent = (function () {
        var timers = {};
        return function (callback, ms, uniqueId) {
            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
                clearTimeout (timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })();

    /* Inject CSS into the DOM*/
	var addCSSRule = (function(style){
	    var sheet = document.head.appendChild(style).sheet;
	    return function(selector, css){
	        var propText = Object.keys(css).map(function(p){
	            return p+":"+css[p];
	        }).join(";");
	        sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
	    }
	})(document.createElement("style"));

    /* generate unique IDs */
    var randomID = (function(){
        var ids = []; var id;
        return function(prefix) {
            do {
                id = prefix + Math.floor(Math.random() * 1000);
            } while(ids.indexOf(id) > -1);
            ids.push(id);
            return id;
        }
    })();

    /* Definition Object for stick direction */
    $.stickyPosition = {
        TOP : {
            position : 'top',
            fixPosition : function(root, pushElement, visibleArea) {
                    return $(window).scrollTop() >= root.height() - visibleArea;
            },
            calcPosition : function(pusher, height) {
                var selector = '#'+pusher.attr("id")+':not(.sticky)';
                addCSSRule(selector, {
            		height: '0 !important'
        		});
            },
            pusher : function(root, pusher) {
                pusher.insertAfter(root);
            }
        },
        BOTTOM : {
            position : 'bottom',
            fixPosition : function(root, pushElement, visibleArea) {
                    return pushElement.offset().top >= $(window).scrollTop() + $(window).height() - visibleArea;
            },
            calcPosition : function(pusher, height) {
                pusher.height(0);
                var selector = '#'+pusher.attr("id")+'.sticky';
                addCSSRule(selector, {
            		height: height + 'px !important'
        		});
        		
            },
            pusher : function(root, pusher) {
                pusher.insertBefore(root);
            }
        }
    }
    
    /* Options */
    var defaults = {
        visibleSticky : '.sticky-visible',
        stickTo : $.stickyPosition.TOP
    };
    
    var sticking = function(root, o)
    {
        var options = $.extend([], defaults, o);
        var id = (root.attr('id') || randomID('sticky'));
        var Rid = '#' + id;
        root.attr('id', id );
        
        var pusher = $('<div/>').attr('id', 'sticky-pusher-'+id).addClass('sticky-pusher');
        options.stickTo.pusher(root, pusher);
        
		addCSSRule(Rid + '.sticky', {
		    position: "fixed"
		});
        
        var fixedElements = $(Rid + ', #sticky-pusher-' + id);
        var sticky = root.find( options.visibleSticky );
        var visibleArea = sticky.outerHeight() || null;

        var calcPosition = function() {
            var height = root.outerHeight();
            pusher.height(height);

            // Lets the footer/header show only the visible area part
            var rules = {};
            rules[options.stickTo.position] = -(height - visibleArea) + 'px';
    		addCSSRule(Rid + '.sticky', rules);
    		options.stickTo.calcPosition(pusher, height);
        };
        
        /* ***********************************************************************************
         * this one dies the "heavy" lifting during scroll events. It should be kept simple!
         *********************************************************************************** */
        var fixPosition = function() {
            if ( options.stickTo.fixPosition(root, pusher, visibleArea || pusher.height()) ) {
                fixedElements.addClass("sticky");
            } else {
                fixedElements.removeClass("sticky");
            }
        };

        // On load and Resize, wait for the final call
        $(window).on( "resize", function() {
            waitForFinalEvent(function() {
                calcPosition();
                fixPosition();
            }, 500, Rid);
        });
        
        // Fast call on scroll events
        $(window).on( "scroll", fixPosition );
        calcPosition(); fixPosition();
    };
    
    /* register a list of sticky elements */
    $.fn.sticky = function(o) {
        return this.each(function(){
            return new sticking($(this), o);
        });
    };
    
})(jQuery);