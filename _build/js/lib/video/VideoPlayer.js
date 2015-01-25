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
	this.$replayButton = this.$container.find('#replayButton');
	this.$replayButton.hide();
	this.$replayButton.on('click', this.playWhenReady.bind(this));
	this.player.donePlayingCallback = this.donePlaying.bind(this);
}

VideoPlayer.prototype.playWhenReady = function () {
	this.player.playWhenReady();
	this.hideReplayButton();
	if (isMobile) {
		this.$container.scrollTo();
	}
}

VideoPlayer.prototype.load = function () {
	this.player.load.apply(this.player, Array.prototype.slice.apply(arguments));
}

VideoPlayer.prototype.hideReplayButton = function () {
	this.$replayButton.fadeOut();
	this.$container.removeClass('hasReplayButton');
}

VideoPlayer.prototype.showReplayButton = function () {
	this.$replayButton.fadeIn();
	this.$container.addClass('hasReplayButton');
}

VideoPlayer.prototype.donePlaying = function () {
	this.showReplayButton();
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