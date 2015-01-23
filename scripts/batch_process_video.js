var fs = require('fs');
var process_video = require('./process_video');
var path = require('path');

var inputDir = process.argv[2];
var outputDir = process.argv[3];

var videos = fs.readdirSync(inputDir);
for (var i = 0; i < videos.length; i++) {
	if (videos[i][0] == '.') {
		continue;
	}

	console.log('processing clip ', videos[i]);
	process_video(path.join(inputDir, videos[i]), outputDir);
}