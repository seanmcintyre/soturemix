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

DataManager.getAvailablePhrases = function (callback) {
	$.get(ROOT_URL + '/clips', function (response) {
		callback(null, response);
	});
};

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