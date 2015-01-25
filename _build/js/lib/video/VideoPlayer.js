var HTMLVideoPlayer = require('./HTMLVideoPlayer');
var JPEGVideoPlayer = require('./JPEGVideoPlayer');
var url = require('url');

var isMobile = /iphone/i.test(navigator.userAgent.toLowerCase());

function VideoPlayer ($container, clipRoot) {
	if (isMobile) {
		return new JPEGVideoPlayer($container, url.resolve(clipRoot, 'mobile/'));
	} else {
		return new HTMLVideoPlayer($container, url.resolve(clipRoot, 'desktop/'));
	}
}

module.exports = VideoPlayer;