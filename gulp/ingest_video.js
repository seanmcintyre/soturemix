var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var db = require('../server/db');
var crypto = require('crypto');
var path = require('path');

const PLUGIN_NAME = 'gulp-video-ingest';

function ingestVideos (options) {

  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (path.basename(file.path) == 'empty') {
      return cb();
    }


    var videoChecksum = checksum(file.contents);
    getVideoByChecksum(videoChecksum, function (err, video) {
      if (err) {
      	this.emit('error', err);
      	return cb(err);
      }

    	if (video) {
				console.log('Video found with id ', video._id);
    		renameFileByID(file, video._id);
    		return cb(null, file);
    	}

    	ingestVideo(rootFilename(file.path), videoChecksum, function (err, video) {
    	  if (err) {
      		this.emit('error', err);
          return cb(err);
	      }

	      if (video) {
  				console.log('Video created with id ', video._id);
	      	renameFileByID(file, video._id);
	      }

	      return cb(null, file);
    	});
    });

  });

  return stream;
};

function getVideoByChecksum(checksum, callback) {
	db.collection('clips', function (err, collection) {
    if (err) {
      return callback(err);
    }

    collection.findOne({checksum: checksum}, callback)
  });
}

function ingestVideo (name, checksum, callback) {
	db.collection('clips', function (err, collection) {
    if (err) {
      return callback(err);
    }

    collection.insert({
  		name: name,
  		checksum: checksum
  	}, function (err, docs) {
  		return callback(err, docs[0]);
  	});
  });
}

function checksum (fileContents) {
	var hash = crypto.createHash('sha1');
	hash.update(fileContents);
	return hash.digest('hex');
}

function renameFileByID (file, id) {
	file.path = path.join(file.base, id + path.extname(file.path));
}

function rootFilename (filename	) {
	var filenameParts = path.basename(filename).split('.');
	return filenameParts.splice(0, filenameParts.length - 1).join('.');
}

module.exports = ingestVideos;