var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var rimraf = require('rimraf');

// var inputFile = './a man took the bus home.mov'
// var outputFileName = './frames/bus_%05d.png';


function rootFilename (filename) {
	var filenameParts = path.basename(filename).split('.');
	return filenameParts.splice(0, filenameParts.length - 1).join('.');
}

function getFramesFromVideo (filename, outputDir, callback) {

	var framesDir = path.join(outputDir, 'frames');
	fs.mkdirSync(framesDir);
	var root = rootFilename(filename);
	var outputFilename = path.join(framesDir, root + '_%03d.png');

	var command = ffmpeg()
					.input(filename)
					.fps(15)
					.size('460x?')
					.output(outputFilename)
					.format('image2');

	command.on('error', function (err) {
		return callback(err);
	});

	command.on('end', function () {
		return callback(null, framesDir);
	});

	command.run();
}

function getAudioFromVideo (filename, outputDir, callback) {
	var outputFilename = path.join(outputDir, rootFilename(filename) + '.mp3');
	var command = ffmpeg()
					.input(filename)
					.output(outputFilename);

	command.on('error', function (err) {
		return callback(err);
	});

	command.on('end', function () {
		return callback();
	});

	command.run();
}


function createFilmstripFromFrames (filename, framesDir, outputDir, callback) {
	var files = fs.readdirSync(framesDir);
	var outputFile = path.join(outputDir, rootFilename(filename) + '.jpg');
	var command = 'convert';
	for (var i = 0; i < files.length; i++) {
		command += ' "';
		command += path.join(framesDir, files[i]);
		command += '"';
	}
	command += ' -append "' + outputFile + '"';

	console.log(command);

	child_process.exec(command, function (err, stdout, stderr) {
		console.log(stdout);
		console.error(stderr);
		callback(err);
		rimraf.sync(framesDir);
	});
}

function processClip (filename, outputDir) {
	var root = rootFilename(filename);
	var videoOutput = path.join(outputDir, root);
	fs.mkdirSync(videoOutput);
	
	getFramesFromVideo(filename, videoOutput, function (err, framesDir) {

		if (err) {
			return handleErrorAndCleanup(err, videoOutput);
		}

		getAudioFromVideo(filename, videoOutput, function (err) {
			if (err) {
				return handleErrorAndCleanup(err, videoOutput);
			}

			createFilmstripFromFrames(filename, framesDir, videoOutput, function (err) {
				if (err) {
					return handleErrorAndCleanup(err, videoOutput);
				}

				console.log('Done!');
			});

		});
	});
}

function handleErrorAndCleanup (err, outputDir) {
	console.error(err);
	rimraf.sync(outputDir);
	process.exit();
}

module.exports = processClip;