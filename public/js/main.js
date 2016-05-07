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


var $authmodal = $('#modal-auth');
var authmodalPanes = $authmodal.find('.auth-box');
window.signinModalTrigger = function signinModalTrigger(e) {
	e.preventDefault();

	var initial = $(this).data("initial") || 'join';
	var initialPane = $authmodal.find('.modal-pane-' + initial);
	var from = $(this).data("from");

	$authmodal.modal('show');
	authmodalPanes.addClass('hidden');
	initialPane.removeClass('hidden');

	if ($(window).width() >= 768) {
		initialPane.find('input[type!=hidden],textarea').eq(0).click().focus();
	}

	if (from) {
		$authmodal.find('[name="from"]').val(from);
	}
}

// init
var $contactmodal = $('#modal-contact');
var contactmodalPanes = $authmodal.find('.auth-box');

window.contactFormTrigger = function contactFormTrigger(e) {
	e.preventDefault();

	var initial = $(this).data("initial") || 'join';
	var initialPane = $authmodal.find('.modal-pane-' + initial);
	var from = $(this).data("from");

	$contactmodal.modal('show');

	contactmodalPanes.addClass('hidden');
	initialPane.removeClass('hidden');

	if ($(window).width() >= 768) {
		initialPane.find('input[type!=hidden],textarea').eq(0).click().focus();
	}

	if (from) {
		$authmodal.find('[name="from"]').val(from);
	}


}

$('.js-contact-trigger').on('click', contactFormTrigger)

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
