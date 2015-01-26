/***

Contains all the available network calls for the app
Callbacks conform to the nodejs async standard (err, result)

***/

var $ = require('jquery-browserify');

var DataManager = module.exports = {};

var ROOT_URL;

if (process.env.production && process.env.production != 'false') {
	ROOT_URL = process.env.api_root;
} else {
	ROOT_URL = location.href.split(':').splice(0, 2).join(':') + ':8000';
}

DataManager.getClips = (function () {
	var _clips, callbacks = [], requestMade = false;
	
	return function (callback) {

		if (_clips) {
			return callback(null, _clips);
		}

		callbacks.push(callback);

		if (!requestMade) {
			requestMade = true;
			$.get(ROOT_URL + '/clips', function (response) {
				_clips = response;

				for (var i = 0; i < callbacks.length; i++) {
					if (callbacks[i] && typeof callbacks[i] === 'function') {
						callbacks[i](null, response);
					}
				}
			});
		}
	}
}());

DataManager.saveVideo = function (video, callback) {
	$.ajax(ROOT_URL + '/videos', {
		data: JSON.stringify(video),
		type: 'POST',
		contentType: 'application/json',
		success: function (data) {
			return callback(null, data);
		}
	});
};

DataManager.getVideo = function (id, callback) {
	var jqXHR = $.ajax(ROOT_URL + '/videos/' + id, {
		type: 'GET',
		contentType: 'application/json',
		success: function (data) {
			console.log(data);
			return callback(null, data);
		}
	});


	jqXHR.fail(function () {
		return callback(true);
	});
};