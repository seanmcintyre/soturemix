var $ = require('jquery-browserify');
var scrollTo = require('./lib/scrollTo');
var theSpeech = require('./lib/theSpeech');
var DataManager = require('./lib/DataManager');
var videoPlayer  = require('./lib/video/VideoPlayer');
var editor = require('./lib/editor');

videoPlayer.init($('#videoContainer'), process.env.video_root);

if (CURRENT_VIDEO) {
    videoPlayer.load(CURRENT_VIDEO.clips);
    videoPlayer.playWhenReady();
    $('.editor').hide();
} else {
    editor.init();
}

$('#vamanos').on('click', function () {
    if (!CURRENT_VIDEO) {
        videoPlayer.load(theSpeech.text);
    }
    videoPlayer.playWhenReady();
});

$('#save').on('click', function () {
    var video = {
        clips: theSpeech.text
    };

    DataManager.saveVideo(video, function (err, result) {
        alert('saved with URL ' + result.shareURL);
    });
});

function getIdFromURL () {
    var search = window.location.search;
    var match = search.match(/_id=([\d\w]+)/);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}
