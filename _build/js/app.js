var $ = require('jquery-browserify');
var theSpeech = require('./lib/theSpeech');
var DataManager = require('./lib/DataManager');
var VideoPlayer  = require('./lib/HTMLVideoPlayer');
var editor = require('./lib/editor');

var videoPlayer = new VideoPlayer($('#videoContainer'));
videoPlayer.setClipsDirectory('./clips/');

$('#vamanos').on('click', function () {
    videoPlayer.load(theSpeech.text);
    videoPlayer.playWhenReady();
});

$('#save').on('click', function () {
    var video = {
        clips: theSpeech.text
    };

    DataManager.saveVideo(video, function (err, result) {
        alert('saved with id ' + result._id);
    });
});
