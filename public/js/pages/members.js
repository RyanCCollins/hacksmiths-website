$(window).bind('load', function(){
	$('.members-list').masonry({
	  // options
	  itemSelector: '.member-item',
	  columnWidth: 200
	});
});
