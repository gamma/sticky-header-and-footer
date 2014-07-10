$(function(){

    var footer = $("footer");
    var sticky = footer.find('div.visibleSticky');
    var push = $("#content div.push");
    var content = $("#content");
    var visibleBottom = sticky.outerHeight() || 50;
    
    var calcPosition = function() {
       var height = footer.outerHeight();
       push.height(height);
       content.css("margin-bottom", -height);
       footer.css('bottom', -(height - visibleBottom));
    }
   
   var fixPosition = function() {
       if ( push.offset().top >= $(window).scrollTop() + $(window).height() - visibleBottom ) {
           footer.addClass("sticky");
       } else {
           footer.removeClass("sticky");
       }
   };
   
   $(window).on( "load resize", calcPosition );
   $(window).on( "load resize scroll", fixPosition );
});
