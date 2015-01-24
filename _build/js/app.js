var $ = require('jquery-browserify');
var theSpeech = require('./lib/theSpeech');
var DataManager = require('./lib/DataManager');
var VideoPlayer  = require('./lib/video/VideoPlayer');
var editor = require('./lib/editor');

var videoPlayer = new VideoPlayer($('#videoContainer'), './video');

console.log('ENV:', process.env.static_root);

var id = getIdFromURL();
if (id) {
    DataManager.getVideo(id, function (err, video) {
        if (err) {
            alert("Uh oh! Couldn't load your video");
            return;
        } else {
            videoPlayer.load(video.clips);
            videoPlayer.playWhenReady();
        }
    });
    $('.editor').hide();
} else {
    editor.init();
}

$('#vamanos').on('click', function () {
    videoPlayer.load(theSpeech.text);
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
