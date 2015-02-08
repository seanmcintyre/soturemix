
var fbTemplate = '<a href="https://www.facebook.com/sharer/sharer.php?u={$URL}" target="_blank">Share on Facebook</a>';
var twTemplate =  '<a href="https://twitter.com/share?url={$URL}" target="_blank">Share on Twitter</a>';

function showPopover () {
	$('#share').removeClass('inactive');
}

function hidePopover () {
	$('#share').addClass('inactive');
}

function setupCloseButton () {
	$('#share .close').on('click', hidePopover);
}

module.exports = {
	initWithURL: function (url) {
		setupCloseButton();
	    var encodedUrl = encodeURIComponent(url);
	    var fb = fbTemplate.replace('{$URL}', encodedUrl);
	    var tw = twTemplate.replace('{$URL}', encodedUrl);
	    $('#share-facebook').html(fb);
	    $('#share-twitter').html(tw);
	    $('#share-url').val(url);
	},
	show: function () {
		showPopover();
	}
}