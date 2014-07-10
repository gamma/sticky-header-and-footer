/* ************************************************************************
    Sticky Definitions
************************************************************************ */
$(function(){
   
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
            content.css('margin-' + definition.stickTo, -height);
            element.css(definition.stickTo, -(height - visibleArea));
        }
        
        var fixPosition = function() {
            if ( definition.stickyFunction(push, visibleArea) ) {
                element.addClass("sticky");
            } else {
                element.removeClass("sticky");
            }
        };
        
        $(window).on( "load resize", calcPosition );
        $(window).on( "load resize scroll", fixPosition );
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