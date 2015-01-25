var express = require('express');
var videos = require('./videos');
var config = require('../config');
var template = require('./template');

var app = express();
app.use(require('body-parser').json());

app.use(function (req, res, next) {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type'
	});
	next();
});

app.get('/', function (req, res) {
	res.send(template.render());
});

app.get('/clips', function (req, res) {
	videos.getClips(function (err, clips) {
		res.send(clips);
	});
});

app.get('/videos/:id', function (req, res, next) {
	if (req.get('content-type') != 'application/json') {
		return next();
	}

	videos.get(req.param('id'), function (err, video) {
		if (err) {
			res.send(500, {error: 'something went wrong'});
		} else {
			res.send(video);
		}
	});
});

app.get('/videos/:id', function (req, res) {
	videos.get(req.param('id'), function (err, video) {
		if (err) {
			res.send(500, err);
		} else {
			// console.log(video);
			res.send(template.render({
				current_video: video,
				current_video_json: JSON.stringify(video)
			}));
		}
	});
});

app.post('/videos', function (req, res) {
	videos.save(req.body, function (err, doc) {
		if (err) {
			console.error(err);
			res.send(500, {error: 'something went wrong'});
		} else {
			res.send(doc);
		}
	});
});

app.listen(config.port);
console.log('App listening on port ' + config.port);