var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
var stream = require('stream');
var fs = require('fs');
var rimraf = require('rimraf');
var gm = require('gm');


const PLUGIN_NAME = 'gulp-video-convert';

var mobileAudio = videoProcessorWithTransform(function (inputFile, outputFile, opts, cb, done) {
	outputFile.path = renameFileWithExtension(inputFile, 'mp3');

	var command = ffmpeg(inputFile.contents)
					.noVideo()
					.audioCodec('libmp3lame')
					.audioBitrate(128)
					.toFormat('mp3')
					.output(outputFile.contents);

	command.on('error', function (err, stdout, stderr) {
		if (opts.verbose) {
			console.log('ffmpeg stdout:', stdout);
			console.error('ffmpeg stderr:', stderr);
		}
		return cb(err);
	});

	command.on('end', function () {
		return cb(null, outputFile);
	});
	done();

	console.log('Processing audio: ' + inputFile.path);
	command.run();
});

function ensureEmptyDirectory(dir, callback) {

	fs.stat(dir, function (err, stat) {
		if (err) {
			return fs.mkdir(dir, callback);
		}

		if (stat.isDirectory()) {
			rimraf(dir, function (err) {
				if (err) {
					return callback(err);
				}

				fs.mkdir(dir, callback);
			});
		}
	});
}

function ensureEmptyDirectorySync (dir) {
	try {
		var stat = fs.statSync(dir);
	} catch (e) {
		fs.mkdirSync(dir);
		return;
	}

	if (stat.isDirectory()) {
		rimraf.sync(dir);
		fs.mkdirSync(dir);
	}

}

function getFramesFromVideo (inputFile, opts, callback) {
	var root = rootFilename(inputFile.path);
	var framesDir = path.join(opts.tmpDir, root);
	ensureEmptyDirectory(framesDir, function (err) {
		if (err) {
			return callback(err);
		}
		var outputFilename = path.join(framesDir, root + '_%03d.png');

		var command = ffmpeg()
						.input(inputFile.contents)
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
	});
}

function createFilmstripFromFrames (framesDir, outputFile, opts, callback) {
	fs.readdir(framesDir, function (err, files) {
		if (err) {
			return callback(err);
		}

		var command = gm(path.join(framesDir, files[0]));
		for (var i = 1; i < files.length; i++) {
			command = command.append(path.join(framesDir, files[i]));
		}
		command.quality(50)
				.setFormat('jpg')
				.stream().pipe(outputFile.contents)
		callback(null, outputFile);
	});
}

var mobileVideo = videoProcessorWithTransform(function (inputFile, outputFile, opts, callback, done) {
	console.log('Processing video: ' + inputFile.path);
	outputFile.path = renameFileWithExtension(inputFile, 'jpg');
	getFramesFromVideo(inputFile, opts, function (err, framesDir) {
		if (err) {
			return callback(err);
		}

		createFilmstripFromFrames(framesDir, outputFile, opts, callback);
	});
}, function (opts) {	// setup
	ensureEmptyDirectorySync(opts.tmpDir);
}, function (opts) {	// teardown
	ensureEmptyDirectorySync(opts.tmpDir);
});

function renameFileWithExtension (file, ext) {
	return path.join(file.base, rootFilename(file.path) + '.' + ext);
}

function rootFilename (filename	) {
	var filenameParts = path.basename(filename).split('.');
	if (filenameParts.length > 1) {
		return filenameParts.splice(0, filenameParts.length - 1).join('.');
	} else {
		return filenameParts[0];
	}
}

function videoProcessorWithTransform (transform, setup, teardown) {
	return function (opts) {
		opts = opts || {};

		if (setup) {
			setup(opts);
		}

		return through.obj(function (file, enc, cb) {
			if (file.isBuffer()) {
		  		this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
				return cb();
			}

			if (path.basename(file.path) == 'empty') {
				return cb();
			}

			if (file.isNull()) {
				this.push(file);
				cb(null, file);
			}

			var outputFile = new gutil.File({
				cwd: file.cwd,
				base: file.base,
				path: file.path,
				contents: through()
			});

			var throughObj = this;
			transform(file, outputFile, opts, cb, function (){
				throughObj.push(outputFile);
			});
		}, function (callback) {
			if (teardown) {
				teardown(opts);
				callback();
			}
		});
	}
}

module.exports = {
	mobileAudio: mobileAudio,
	mobileVideo: mobileVideo
}