var $ = require('jquery-browserify');
var scrollTo = require('./lib/scrollTo');
var theSpeech = require('./lib/theSpeech');
var DataManager = require('./lib/DataManager');
var videoPlayer  = require('./lib/video/VideoPlayer');
var editor = require('./lib/editor');
var isMobile = require('./lib/isMobile');
var videoFromPhrases = require('./lib/videoFromPhrases');
var share = require('./lib/share');

videoPlayer.init($('#videoContainer'), process.env.video_root);

$(function() {
    Origami.fastclick(document.body);
});

if (CURRENT_VIDEO) {
    videoPlayer.load(CURRENT_VIDEO.clips);
    if (!isMobile) {
        videoPlayer.playWhenReady();
    } else {
        videoPlayer.showReplayButton();
    }
    $('.editor').hide();
} else {
    editor.init();
}

$('#vamanos').on('click', function () {
    if (!CURRENT_VIDEO) {
        videoPlayer.load(videoFromPhrases(theSpeech.text).clips);
    }
    videoPlayer.playWhenReady();
});

$('#save').on('click', function () {
    if (CURRENT_VIDEO) {
        share.initWithURL(CURRENT_VIDEO.shareURL);
        share.show();
    } else {
        var video = videoFromPhrases(theSpeech.text);

        DataManager.saveVideo(video, function (err, result) {
            share.initWithURL(result.shareURL);
            share.show();
        });
    }
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
