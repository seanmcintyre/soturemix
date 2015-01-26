var db = require('../server/db');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');

db.open(function () {
	processVideos(process.argv[2], process.argv[3]);
});

function processVideos (inputDir, outputDir) {
	var videos = fs.readdirSync(inputDir);
	for (var i = 0; i < videos.length; i++) {
		if (videos[i][0] == '.') {
			continue;
		}

		processVideo(path.join(inputDir, videos[i]), outputDir);
	}
}

function processVideo (videoPath, outputDir) {
	var videoName = rootFilename(videoPath);
	console.log('Processing video', videoName);

	var hash = createVideoHash(videoName);
	db.collection('clips').findOne({hash: hash}, function (err, clip) {
		if (err) {
			throw err;
		}

		if (clip) {
			console.log('Video found with id ', clip._id);
			moveVideo(videoPath, clip._id, outputDir);
			return;
		}

		db.collection('clips').insert({
			phrase: videoName,
			hash: hash
		}, function (err, clip) {
			console.log('Video created with id ', clip[0]._id);
			moveVideo(videoPath, clip[0]._id, outputDir);
		});
	});
}

function moveVideo (videoPath, filename, outputDir) {
	fs.createReadStream(videoPath)
		.pipe(fs.createWriteStream(path.join(outputDir, filename + path.extname(videoPath))))
		.on('finish',function () {
			console.log('Finished writing file ' + rootFilename(videoPath));
		})
		.on('error', function (err) {
			throw err;
		});
}

// Create a case & punctuation insensitive hash to keep track of the clip
function createVideoHash (video) {
    var hash = crypto.createHash('sha1');
    hash.update(video.toLowerCase().replace(/[^\w\d]/g, ''));
    return hash.digest('hex');
}

function rootFilename (filename) {
	var filenameParts = path.basename(filename).split('.');
	return filenameParts.splice(0, filenameParts.length - 1).join('.');
}
