var db = require('./db');
var config = require('./config');
var _ = require('underscore');
var fs = require('fs');

var clips = [];

function loadClips () {
	fs.readdir(config.clipsDirectory, function (err, files) {
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

			callback(null, video);
		});
	},

	save: function (video, callback) {
		var clips = video.clips;

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
			appName: config.appName
		};

		db.collection('videos').insert(video, callback);
	},

	// Async in case this involves a network call in the future
	getClips: function (callback) {
		process.nextTick(function () {
			callback(null, clips);
		});
	}
};
