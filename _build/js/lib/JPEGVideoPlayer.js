var Clip = require('./JPEGVideoPlayerClip');

function JPEGVideoPlayer ($container) {
	this.clips = [];


	this.videoContext = this.createVideoContext($container);
	this.audioContext = new webkitAudioContext();
	this.currentClip = null;
	this.setFps(15);
	this.clipsReadyCallbacks = [];
	this.previousTimestamp = 0;

	this.initialClipTimestamp = 0;
};

///////////////////////
// VideoPlayer methods
//////////////////////

JPEGVideoPlayer.prototype.load = function (video) {
	this.clips = this.createClipsFromVideo(video);
	this.currentClip = this.clips[0];
	this.currentClipIndex = 0;

	for (var i = 0; i < this.clips.length; i++) {
		this.clips[i].player = this;
		this.clips[i].load();
		this.clips[i].onReady(this.clipBecameReady.bind(this));
	}
};

JPEGVideoPlayer.prototype.play = function () {

	if (!this.drawing) {
		this.drawing = true;
		this.requestFrameIfNeeded();
	}
};

JPEGVideoPlayer.prototype.playWhenReady = function () {
	if (!this.allClipsAreReady()) {
		this.onAllClipsReady(this.play.bind(this));
		return;
	} else {
		this.play();
	}
}

JPEGVideoPlayer.prototype.stop = function () {
	this.drawing = false;
};

JPEGVideoPlayer.prototype.setClipsDirectory = function (directory) {
	this.clipsDirectory = directory;
};

JPEGVideoPlayer.prototype.setFileExtention = function (extention) {
	this.fileExtention = extention;
};

////////////////////
// Internal methods
///////////////////

JPEGVideoPlayer.prototype.createClipsFromVideo = function (video) {
	var clips = [];
	for (var i = 0; i < video.length; i++) {
		var imageFileName = this.clipsDirectory + video[i] + '/' + video[i] + '.jpg';
		var audioFileName = this.clipsDirectory + video[i] + '/' + video[i] + '.mp3';

		clips.push(new Clip(imageFileName, audioFileName));
	}
	return clips;
}

JPEGVideoPlayer.prototype.createVideoContext = function ($container) {
	var $canvas = $('<canvas />');
	$canvas.css({
		width: '100%',
		height: '100%'
	});
	$container.append($canvas);
	var ctx = $canvas[0].getContext('2d')
	return ctx;
}

JPEGVideoPlayer.prototype.setFps = function (fps) {
	this.fps = fps;
	this.mpf = 1000 / fps;
};

JPEGVideoPlayer.prototype.drawFrame = function () {
	this.currentTimestamp = new Date().getTime();
	
	if (!this.currentClip) {
		return;
	}

	// console.log('in drawframe!');

	if (this.currentTimestamp - this.previousTimestamp > this.mpf) {
		if (!this.currentClip.hasStartedPlaying) {
			this.startPlayingClip(this.currentClip);
		} else if (this.currentClip.hasNextFrame()) {
			this.currentClip.setFrame(Math.floor((this.currentTimestamp - this.initialClipTimestamp) / this.mpf));
			this.currentClip.drawFrame(this.videoContext);
		} else {
			this.playNextClip();
		}

		this.previousTimestamp = this.currentTimestamp;
	} else {
		// console.log(this.currentTimestamp - this.previousTimestamp, this.mpf);
		// console.log('skipping frame');
	}

	this.requestFrameIfNeeded();
};

JPEGVideoPlayer.prototype.stopPlayingClip = function (clip) {
	clip.hasStartedPlaying = false;
	clip.setFrame(0);
};

JPEGVideoPlayer.prototype.startPlayingClip = function (clip) {
	clip.hasStartedPlaying = true;
	this.initialClipTimestamp = this.currentTimestamp;
	clip.setFrame(0);
	clip.drawFrame(this.videoContext);
	clip.playAudio();
};

JPEGVideoPlayer.prototype.playNextClip = function () {
	this.stopPlayingClip(this.currentClip);

	this.currentClipIndex++;
	if (this.currentClipIndex < this.clips.length) {
		this.currentClip = this.clips[this.currentClipIndex];
		this.startPlayingClip(this.currentClip);
	} else {
		this.donePlaying();
	}
};

JPEGVideoPlayer.prototype.donePlaying = function () {
	if (!this.looping) {
		this.currentClip = null;
		this.drawing = false;
	} else {
		this.currentClipIndex = -1;
		this.playNextClip();
	}
};

JPEGVideoPlayer.prototype.requestFrameIfNeeded = function () {
	if (this.drawing) {
		requestAnimationFrame(this.drawFrame.bind(this));
	}
};

JPEGVideoPlayer.prototype.allClipsAreReady = function () {
	for (var i = 0; i < this.clips.length; i++) {
		if (!this.clips[i].ready) {
			return false;
		}
	}

	return true;
};

JPEGVideoPlayer.prototype.clipBecameReady = function () {
	if (this.allClipsAreReady()) {
		for (var i = 0; i < this.clipsReadyCallbacks.length; i++) {
			this.clipsReadyCallbacks[i].call();
		}
	}
};

JPEGVideoPlayer.prototype.onAllClipsReady = function (fn) {
	this.clipsReadyCallbacks.push(fn);
};


JPEGVideoPlayer.prototype.playDummySound = function () {
	// Play dummy sound for iOS
 
	var source = this.audioContext.createBufferSource();
	source.buffer = this.audioContext.createBuffer(1, 22050, 22050);
	source.connect(this.audioContext.destination);
	source.start(0);
};

module.exports = JPEGVideoPlayer;