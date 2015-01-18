/***

Contains all the available network calls for the app
Callbacks conform to the nodejs async standard (err, result)

***/

var ROOT_URL = 'http://localhost:8000';

var $ = require('jquery-browserify');

var DataManager = module.exports = {};

DataManager.getAvailablePhrases = function (callback) {
	$.get(ROOT_URL + '/clips', function (response) {
		callback(null, response);
	});
};

DataManager.saveVideo = function (video, callback) {
	console.log(video);
	$.ajax(ROOT_URL + '/videos', {
		data: JSON.stringify(video),
		type: 'POST',
		contentType: 'application/json',
		success: function (data) {
			return callback(null, data);
		}
	});
};
