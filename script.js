/* ************************************************************************
    Sticky Definitions
    Author: Gerry Weißbach
    GitHub: https://github.com/gamma/sticky-header-and-footer
************************************************************************ */
$(function(){
   
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

    /* General Function */
    var stickyFunction = function(definition){
    
        var element = $(definition.root);
        if ( !element.length > 0 ) {
            return;
        }
        
        var sticky = element.find("div.visibleSticky");
        var visibleArea = sticky.outerHeight() || 50;
        
        var content = $("#content");
        var push = content.find('div.push-' + definition.root);
        
        var calcPosition = function() {
            var height = element.outerHeight();
            push.height(height);

            // Lets the footer/header show only the visible area part
            content.css('margin-' + definition.stickTo, -height);
            element.css(definition.stickTo, -(height - visibleArea));
        }
        
        /* this one dies the "heavy" lifting during scroll events. It should be kept simple! */
        var fixPosition = function() {
            if ( definition.stickyFunction(push, visibleArea) ) {
                element.addClass("sticky");
            } else {
                element.removeClass("sticky");
            }
        };

        // On load and Resize, wait for the final call
        $(window).on( "load resize", function() {
            waitForFinalEvent(function() {
                calcPosition();
                fixPosition();
            }, 500, definition.root);
        });
        
        // Fast call on scroll events
        $(window).on( "scroll", fixPosition );
    };
    
    /* HEADER */
    var headerDef = {
        root : 'header',
        stickTo : 'top',
        stickyFunction : function(pushElement, visibleArea) {
            return $(window).scrollTop() >= pushElement.height() - visibleArea;
        }
    };
    
    /* FOOTER */
    var footerDef = {
        root : 'footer',
        stickTo : 'bottom',
        stickyFunction : function(pushElement, visibleArea) {
            return pushElement.offset().top >= $(window).scrollTop() + $(window).height() - visibleArea;
        }
    };
    
    /* INIT */
   stickyFunction(headerDef);
   stickyFunction(footerDef);
});