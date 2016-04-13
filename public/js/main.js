$(function() {
  // this will get the full URL at the address bar
  var url = window.location.href;

  // passes on every "a" tag
  $("#nav-right a").each(function() {
    // checks if its the same on the address bar
    if (url == (this.href)) {
      $(this).closest("li").addClass("active");
    }
  });
});

// Generic confirms
// ------------------------------

$('.js-confirm').click(function(e) {
  if (!confirm($(this).data('confirm') ||
      'Are you sure? This cannot be undone.'))
    return e.preventDefault();
});

// UI Reveal
// ------------------------------

$('.ui-reveal__trigger').click(function() {
  container = $(this).closest('.ui-reveal');

  container.addClass('is-revealed');

  //- click ensures browse is envoked on file fields
  container.find('input[type!=hidden],textarea').eq(0).click().focus();
});

$('.ui-reveal__hide').click(function() {
  container = $(this).closest('.ui-reveal');

  container.removeClass('is-revealed');
});



// Signin / Join Modal
// ------------------------------

// init
var $authmodal = $('#modal-auth');
var authmodalPanes = $authmodal.find('.auth-box');

// start on the right pane
// defaults to "join"
// options "signin" | "join" | "password"

// MAKESHIFT WAY TO EXPOSE JQUERY AUTH LOGIC TO REACT
window.signinModalTrigger = function signinModalTrigger(e) {

  e.preventDefault();

  var initial = $(this).data("initial") || 'join';
  var initialPane = $authmodal.find('.modal-pane-' + initial);
  var from = $(this).data("from");

  $authmodal.modal('show');

  authmodalPanes.addClass('hidden');
  initialPane.removeClass('hidden');

  // only focus the first field on large devices where showing
  // the keyboard isn't a jarring experience
  if ($(window).width() >= 768) {
    initialPane.find('input[type!=hidden],textarea').eq(0).click().focus();
  }

  if (from) {
    $authmodal.find('[name="from"]').val(from);
  }
}

$("[href='#modal-auth'], [data-modal='auth'], .js-auth-trigger").on('click',
  signinModalTrigger);

// move between panes
$("[rel='modal-pane']").click(function() {

  var switchTo = $authmodal.find('.modal-pane-' + $(this).data("modal-pane"));

  authmodalPanes.addClass('hidden');
  switchTo.removeClass('hidden');


  // only focus the first field on large devices where showing
  // the keyboard isn't a jarring experience
  if ($(window).width() >= 768) {
    switchTo.find('input[type!=hidden],textarea').eq(0).click().focus();
  }

});

/* detect touch */
if ("ontouchstart" in window) {
  document.documentElement.className = document.documentElement.className +
    " touch";
}
if (!$("html").hasClass("touch")) {
  /* background fix */
  $(".parallax").css("background-attachment", "fixed");
}

/* fix vertical when not overflow
call fullscreenFix() if .fullscreen content changes */
function fullscreenFix() {
  var h = $('body').height();
  // set .fullscreen height
  $(".content-sub").each(function(i) {
    if ($(this).innerHeight() > h) {
      $(this).closest(".fullscreen").addClass("overflow");
    }
  });
}
$(window).resize(fullscreenFix);
fullscreenFix();

/* resize background images */
function backgroundResize() {
  var windowH = $(window).height();
  $(".background").each(function(i) {
    var path = $(this);
    // variables
    var contW = path.width();
    var contH = path.height();
    var imgW = path.attr("data-img-width");
    var imgH = path.attr("data-img-height");
    var ratio = imgW / imgH;
    // overflowing difference
    var diff = parseFloat(path.attr("data-diff"));
    diff = diff ? diff : 0;
    // remaining height to have fullscreen image only on parallax
    var remainingH = 0;
    if (path.hasClass("parallax") && !$("html").hasClass("touch")) {
      var maxH = contH > windowH ? contH : windowH;
      remainingH = windowH - contH;
    }
    // set img values depending on cont
    imgH = contH + remainingH + diff;
    imgW = imgH * ratio;
    // fix when too large
    if (contW > imgW) {
      imgW = contW;
      imgH = imgW / ratio;
    }

    if (contH > imgH) {
      console.log('Too Big');
    }
    //
    path.data("resized-imgW", imgW);
    path.data("resized-imgH", imgH);
    path.css("background-size", imgW + "px " + imgH + "px");
  });
}
$(window).resize(backgroundResize);
$(window).focus(backgroundResize);
backgroundResize();

/* set parallax background-position */
function parallaxPosition(e) {
  var heightWindow = $(window).height();
  var topWindow = $(window).scrollTop();
  var bottomWindow = topWindow + heightWindow;
  var currentWindow = (topWindow + bottomWindow) / 2;
  $(".parallax").each(function(i) {
    var path = $(this);
    var height = path.height();
    var top = path.offset().top;
    var bottom = top + height;
    // only when in range
    if (bottomWindow > top && topWindow < bottom) {
      var imgW = path.data("resized-imgW");
      var imgH = path.data("resized-imgH");
      // min when image touch top of window
      var min = 0;
      // max when image touch bottom of window
      var max = -imgH + heightWindow;
      // overflow changes parallax
      var overflowH = height < heightWindow ? imgH - height : imgH -
        heightWindow; // fix height on overflow
      top = top - overflowH;
      bottom = bottom + overflowH;
      // value with linear interpolation
      var value = min + (max - min) * (currentWindow - top) / (bottom - top);
      // set background-position
      var orizontalPosition = path.attr("data-oriz-pos");
      orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
      $(this).css("background-position", orizontalPosition + " " + value +
        "px");
    }
  });
}
if (!$("html").hasClass("touch")) {
  $(window).resize(parallaxPosition);
  //$(window).focus(parallaxPosition);
  $(window).scroll(parallaxPosition);
  parallaxPosition();
}

function calculateImageContentHeight() {
  $('.content-main').height =
}

// Initialize foundation
$(document).foundation(console.log('Initialized'));
