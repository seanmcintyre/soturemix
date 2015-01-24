var AudioPlayer = require('./AudioPlayer');

var Clip = function (imageFileName, audioFileName) {
	this.imageFileName = imageFileName;
	this.audioFileName = audioFileName;

	this.currentFrame = 0;

	this.readyCallbacks = [];

	this.hasLoadedImage = false;
	this.hasLoadedAudio = false;
	this.ready = false;
};

Clip.prototype.load = function () {
	this.frameImage = new Image();
	this.frameImage.src = this.imageFileName;
	this.frameImage.onload = this.didLoadImage.bind(this);

	this.audioPlayer = new AudioPlayer(this.audioFileName, this.player.audioContext);
	this.audioPlayer.onReady(this.didLoadAudio.bind(this));
	this.audioPlayer.load();
};

Clip.prototype.didLoadImage = function () {
	this.hasLoadedImage = true;
	this.fireReadyEvent();
};

Clip.prototype.didLoadAudio = function () {
	this.hasLoadedAudio = true;
	this.fireReadyEvent();
};

Clip.prototype.fireReadyEvent = function () {
	if (this.hasLoadedImage && this.hasLoadedAudio) {
		this.ready = true;
		for (var i = 0; i < this.readyCallbacks.length; i++) {
			this.readyCallbacks[i].call();
		}
	}
};

Clip.prototype.onReady = function (fn) {
	this.readyCallbacks.push(fn);
};

Clip.prototype.playAudio = function () {
	this.audioPlayer.play();
};

Clip.prototype.numberOfFrames = function () {
	return Math.floor(this.frameImage.height / this.frameHeight);
};

Clip.prototype.setFrame = function (frame) {
	this.currentFrame = frame;
};

Clip.prototype.hasNextFrame = function () {
	return this.currentFrame + 1 < this.numberOfFrames();
};

Clip.prototype.advanceFrame = function () {
	this.currentFrame += 1;
};

Clip.prototype.drawFrame = function (context) {
	var drawWidth, drawHeight;

	if (context.canvas.width / context.canvas.height > 1) {
		drawWidth = context.canvas.width;
		drawHeight = context.canvas.width * (this.frameHeight / this.frameWidth);
	} else {
		drawHeight = context.canvas.height;
		drawWidth = context.canvas.height * (this.frameWidth / this.frameHeight);
	}

	context.drawImage(this.frameImage, 0, this.currentFrame * this.frameHeight,
		this.frameWidth, this.frameHeight, 0, 0, drawWidth, drawHeight);

};

module.exports = Clip