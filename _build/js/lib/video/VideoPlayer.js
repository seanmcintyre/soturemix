var HTMLVideoPlayer = require('./HTMLVideoPlayer');
var JPEGVideoPlayer = require('./JPEGVideoPlayer');
var url = require('url');

var isMobile = /iphone/i.test(navigator.userAgent.toLowerCase());

function VideoPlayer ($container, clipRoot) {
	if (isMobile) {
		this.player = new JPEGVideoPlayer($container, url.resolve(clipRoot, 'mobile/'));
	} else {
		this.player = new HTMLVideoPlayer($container, url.resolve(clipRoot, 'desktop/'));
	}
	this.$container = $container;
}

VideoPlayer.prototype.playWhenReady = function () {
	this.player.playWhenReady();
	if (isMobile) {
		this.$container.scrollTo();
	}
}

VideoPlayer.prototype.load = function () {
	this.player.load.apply(this.player, Array.prototype.slice.apply(arguments));
}

var _player;
module.exports = {
	init: function ($container, clipRoot) {
		_player = new VideoPlayer($container, clipRoot);
	},
	playWhenReady: function () {
		_player.playWhenReady();
	},
	load: function (clips) {
		_player.load(clips);
	}
}