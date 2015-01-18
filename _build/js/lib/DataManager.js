/***

Contains all the available network calls for the app
Callbacks conform to the nodejs async standard (err, result)

***/


var $ = require('jquery-browserify');

var DataManager = module.exports = {};

DataManager.getAvailablePhrases = function (callback) {

	// TODO: get this from an API 
	var clips = [
		'a farmer',
		'a man took the bus home',
		'a teacher',
		'all across america',
		'america',
		'americas graduation rate',
		'an entreprenuer',
		'and did her part',
		'bone tired',
		'dreaming big dreams',
		'eight million new jobs',
		'fathers',
		'flipped on the lights',
		'for his son',
		'four years',
		'graveyard shift',
		'highest levels',
		'mothers',
		'mrspeaker',
		'tech startup',
		'three decades',
		'to lift',
		'ween itself off foreign oil'
	];

	callback(null, clips);
};
