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