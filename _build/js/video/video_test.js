var HTMLVideoPlayer = require('./HTMLVideoPlayer/HTMLVideoPlayer');

$(function () {
	var isMobile = false,
	videoPlayer;

	var video = [
		'a farmer',
		'flipped on the lights',
		'for his son',
		'to lift',
		'eight million new jobs',
		'all across america'
	];

	var $videoContainer = $('#videoContainer');

	if (isMobile) {
		videoPlayer = new JPEGVideoPlayer($videoContainer);
	} else {
		videoPlayer = new HTMLVideoPlayer($videoContainer);
	}

	videoPlayer.setClipsDirectory('./clips/');
	videoPlayer.load(video);
	videoPlayer.playWhenReady();
});