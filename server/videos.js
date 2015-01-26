var db = require('./db');
var config = require('../config');
var _ = require('underscore');
var fs = require('fs');

var clips;
if (config.clipsDirectory) {
	console.log('Loading clips from local directory');
	clips = [];
	function loadClips () {
		fs.readdir('./targets/dev/video/desktop', function (err, files) {
			if (err) {
				throw err;
			}

			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				if (file[0] === '.') {
					continue;
				}

				var pathComponents = file.split('.');
				clips.push(pathComponents[0]);
			}
		});
	}
	loadClips();
} else {
	console.log('Loading clips from JSON file');
	clips = require('../config/clips');
}

function shareURLForVideo (video) {
	return config.rootURL + video._id;
}

module.exports = {
	get: function (id, callback) {
		db.collection('videos').findOne({_id: db.ObjectId(id)}, function (err, video) {
			if (err) {
				return callback(err);
			} else if (!video) {
				return callback(new Error('Video not found'));
			} else if (video.appName != config.appName) {
				return callback(new Error('Video created by wrong app'));
			}

			video.shareURL = shareURLForVideo(video);
			video.phrases = video.clips;
			callback(null, video);
		});
	},

	save: function (video, callback) {
		var clips = video.clips;
		var phrases = video.phrases;

		// Do some basic sanity checking here — for now,
		// just make sure all clips are strings
		// Later we'll want to make sure they're all valid clips
		function invalidVideo () {
			return callback(new Error('Invalid video'));
		}

		for (var i = 0; i < clips.length; i++) {
			if (!_.isString(clips[i])) {
				return process.nextTick(invalidVideo);
			}
		}

		video = {
			clips: clips,
			phrases: phrases,
			appName: config.appName
		};

		db.collection('videos').insert(video, function (err, docs) {
			if (err) {
				return callback(err);
			}

			if (!docs || !docs.length || docs.length === 0) {
				return callback(new Error('something went wrong'));
			}

			var newVideo = docs[0];
			newVideo.shareURL = shareURLForVideo(newVideo);
			return callback(null, newVideo);
		});
	},

	getClips: function (callback) {
		db.collection('clips').find().toArray(function (err, clips) {
			if (err) {
				return callback(err);
			}

			return callback(null, clips);
		});
	}
};
