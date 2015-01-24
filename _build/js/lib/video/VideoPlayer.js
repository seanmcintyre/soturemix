var HTMLVideoPlayer = require('./HTMLVideoPlayer');
var JPEGVideoPlayer = require('./JPEGVideoPlayer');
var path = require('path');

var isMobile = false;

function VideoPlayer ($container, clipRoot) {
	if (isMobile) {
		return new JPEGVideoPlayer($container, path.join(clipRoot, 'mobile'));
	} else {
		return new HTMLVideoPlayer($container, path.join(clipRoot, 'desktop'));
	}
}

module.exports = VideoPlayer;