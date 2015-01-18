
function HTMLVideoPlayer ($container) {
	this.$container = $container;
	this.currentVideo = [];
	this.currentClipIndex = 0;
	this.currentVideoElementIndex = 0;
	this.clipsDirectory = './';
	this.fileExtention = 'mp4';

	this.createVideoElements();
}


///////////////////////
// VideoPlayer methods
//////////////////////

HTMLVideoPlayer.prototype.load = function (video) {
	this.currentVideo = video;
	this.currentClipIndex = -1;
};

HTMLVideoPlayer.prototype.play = function () {
	this.setupNextVideo();
	this.nextVideo();
};

HTMLVideoPlayer.prototype.stop = function () {
	// TODO: implement this
};

HTMLVideoPlayer.prototype.playWhenReady = function () {
	// TODO: check video loading status & defer playback as needed
	this.play();
};

HTMLVideoPlayer.prototype.setClipsDirectory = function (directory) {
	this.clipsDirectory = directory;
};

HTMLVideoPlayer.prototype.setFileExtention = function (extention) {
	this.fileExtention = extention;
};


////////////////////
// Internal methods
///////////////////

HTMLVideoPlayer.prototype.createVideoElements = function () {
	this.$videoElements = [];
	var $video;
	for (var i = 0; i < 2; i++) {
		$video = $('<video />');
		$video.height(this.$container.height());
		$video.width(this.$container.width());
		this.$container.append($video);
		$video.on('ended', this.nextVideo.bind(this));
		this.$videoElements.push($video);
	}
	this.$videoElements[1].hide();
};

HTMLVideoPlayer.prototype.setupNextVideo = function () {
	this.currentClipIndex++;

	if (this.currentClipIndex.length >= this.currentVideo.length) {
		if (this.looping) {
			this.currentClipIndex = 0;
		} else {
			this.stop();
		}
	}

	var	videoElement = this.getNextVideoElement()[0];
	videoElement.src = this.getURIForClip(this.currentVideo[this.currentClipIndex]);
};

HTMLVideoPlayer.prototype.getURIForClip = function (clip) {
	// TODO: normalize URL
	return this.clipsDirectory + clip + '.' + this.fileExtention;
};

HTMLVideoPlayer.prototype.nextVideo = function () {
	var $videoElement1 = this.$videoElements[this.currentVideoElementIndex];
	var $videoElement2 = this.switchPlayers();
	$videoElement2[0].play();
	$videoElement1.hide();
	$videoElement2.show();
	this.setupNextVideo();
};

HTMLVideoPlayer.prototype.switchPlayers = function () {
	this.currentVideoElementIndex = this.getNextVideoElementIndex();
	return this.$videoElements[this.currentVideoElementIndex];
};

HTMLVideoPlayer.prototype.getNextVideoElementIndex = function () {
	var nextIndex = this.currentVideoElementIndex + 1;
	if (nextIndex >= this.$videoElements.length) {
		nextIndex = 0;
	}

	return nextIndex;
};

HTMLVideoPlayer.prototype.getNextVideoElement = function () {
	return this.$videoElements[this.getNextVideoElementIndex()];
};

module.exports = HTMLVideoPlayer;