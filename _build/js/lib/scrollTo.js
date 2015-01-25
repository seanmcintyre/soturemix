$.fn.scrollTo = function () {
	var offset = $(this).offset().top;
	$('body').animate({
		scrollTop: offset
	});
};