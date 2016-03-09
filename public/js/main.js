jQuery(window).scroll(function() {
    if (scroll >= 50) {
        $('#logo-image').attr('src', 'img/Acme_Monogram_Colour.png')
        $(".important-class").addClass("padding-on-my-header");
    }
    if (scroll < 50) {
        $(".important-class").removeClass("padding-on-my-header");
        $('#logo-image').attr('src', 'img/Acme_Colour.png')
    }
});

$(function(){
    // this will get the full URL at the address bar
    var url = window.location.href;

    // passes on every "a" tag
    $("#nav-right a").each(function() {
            // checks if its the same on the address bar
        if(url == (this.href)) {
            $(this).closest("li").addClass("active");
        }
    });
});