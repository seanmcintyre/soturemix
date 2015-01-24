var AudioPlayer = function (fileName, audioContext) {
	this.context = audioContext;
	this.fileName = fileName;
	this.isReady = false;
	this.readyCallbacks = [];
};

AudioPlayer.prototype.load = function () {
	var _this = this;
	
	var request = new XMLHttpRequest();
	request.open('GET', this.fileName, true);
	request.responseType = 'arraybuffer';
	
	request.onload = function () {
		_this.context.decodeAudioData(request.response, _this.didLoadAudio.bind(_this));
	};

	request.send();
};

AudioPlayer.prototype.didLoadAudio = function (buffer) {
	if (this.isReady) {
		return;
	}
	
	this.isReady = true;
	this.buffer = buffer;

	if (this.readyCallbacks.length) {
		for (var i in this.readyCallbacks) {
			this.readyCallbacks[i].call();
		}
	}
};

AudioPlayer.prototype.onReady = function (fn) {
	this.readyCallbacks.push(fn);
};

AudioPlayer.prototype.play = function (fn) {
	var source = this.context.createBufferSource();
	source.buffer = this.buffer;
	source.connect(this.context.destination);
	source.start(0);
};

module.exports = AudioPlayer;