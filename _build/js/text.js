var $ = require('jquery-browserify');
var theSpeech = require('./theSpeech');
var matches = require('./matches');
var DataManager = require('./lib/DataManager');
var VideoPlayer  = require('./lib/HTMLVideoPlayer');

var lastKey;
var phrases = []; // will be filled in by network call
var text;
var subStr;

DataManager.getAvailablePhrases(function (err, availablePhrases) {
    phrases = availablePhrases;
});

$('.add-phrase').keyup(function(event) {
    text = $(this).val();
    matches.matchList = [];

    // Loop through phrases to display matches
    subStr = new RegExp(text);
    matches.findMatches(subStr, phrases);

    // enter key
    if (event.keyCode == 13 && phrases.indexOf(text) > -1) {
        theSpeech.addPhrase(text);
    }
    if (event.keyCode == 13 && phrases.indexOf(text) == -1) {
        matches.selectedMatchText = matches.selectedMatch.text();
        theSpeech.addPhrase(matches.selectedMatchText);
    }
    // backspace key
    if( event.keyCode == 8 ) {
        theSpeech.removeLastPhrase(text, lastKey);
    }
    // down/right arrow keys
    if (event.keyCode == 40 || event.keyCode == 39) {
        matches.selectMatch('next');
    }
    // up/left arrow keys
    if (event.keyCode == 38 || event.keyCode == 37) {
        matches.selectMatch('prev');
    }
    // Backspace manager
    if (text.length == 0) {
        lastKey = event.keyCode;
    } else {
        lastKey = null;
    }
});

$('.matches').on('click', '.match', function (){
    theSpeech.addPhrase($(this)[0].innerText);
});

var videoPlayer = new VideoPlayer($('#videoContainer'));
videoPlayer.setClipsDirectory('./clips/');

$('#vamanos').on('click', function () {
    videoPlayer.load(theSpeech.text);
    videoPlayer.playWhenReady();
});

$('#save').on('click', function () {
    var video = {
        clips: remixedSOTU
    };

    DataManager.saveVideo(video, function (err, result) {
        alert('saved with id ' + result._id);
    });
});
