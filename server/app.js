var express = require('express');
var videos = require('./videos');
var config = require('./config');

var app = express();
app.use(require('body-parser').json());

app.use(function (req, res, next) {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type'
	});
	next();
});

app.get('/clips', function (req, res) {
	videos.getClips(function (err, clips) {
		res.send(clips);
	});
});

app.get('/videos/:id', function (req, res) {
	videos.get(req.param('id'), function (err, video) {
		if (err) {
			res.send(500, {error: 'something went wrong'});
		} else {
			res.send(video);
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