var dataManager = require('./dataManager');

var allClipsByPhrase = {};
dataManager.getClips(function (err, clips) {
	for (var i = 0; i < clips.length; i++) {
		allClipsByPhrase[clips[i].name] = clips[i];
	}
});

function videoFromPhrases (phrases) {
	var clips = [];

	for (var i = 0; i < phrases.length; i++) {
		if (allClipsByPhrase[phrases[i]]) {
			clips.push(allClipsByPhrase[phrases[i]]._id);
		}
	}

	return {
		clips: clips,
		phrases: phrases
	};
}

module.exports = videoFromPhrases;