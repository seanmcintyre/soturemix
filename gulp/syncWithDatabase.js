var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'gulp-video-ingest';

// plugin level function (dealing with files)
function ingestVideos (options) {

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    var videoChecksum = checksum(file.contents);

    getVideoByChecksum(videoExists, function (err, video) {
      if (err) {
      	this.emit('error', err));
      	return cb();
      }

    	if (video) {
				console.log('Video found with id ', clip._id);
    		renameFileByID(file, video._id);
    		return cb();
    	}

    	ingestVideo(rootFilename(file.path), checksum, function (err, video) {
    	  if (err) {
      		this.emit('error', err));
	      }
	      if (video) {
  				console.log('Video created with id ', clip[0]._id);
	      	renameFileByID(file, video._id);
	      }
	      return cb();
    	});

    });

    this.push(file);

    // tell the stream engine that we are done with this file
    cb();
  });

  // returning the file stream
  return stream;
};

// exporting the plugin main function
module.exports = gulpPrefixer;

function getVideoByChecksum(checksum, callback) {
	db.collection('clips').findOne({checksum: checksum}, callback);
}

function ingestVideo (name, checksum, callback) {
	db.collection('clips').insert({
		name: name,
		checksum: checksum
	}, function (err, docs) {
		return callback(err, docs[0]);
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