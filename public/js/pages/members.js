$(window).bind('load', function(){
	$('.members-list').masonry({
	  // options
	  itemSelector: '.member-item',
	});
	$('is-tooltip').tooltip();
});
