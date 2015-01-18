var $ = require('jquery-browserify');
var DataManager = require('./lib/DataManager');
var VideoPlayer  = require('./lib/HTMLVideoPlayer');

var phrases = []; // will be filled in by network call
var matches = [];
var lastKey;
var remixedSOTU = [];

DataManager.getAvailablePhrases(function (err, availablePhrases) {
    phrases = availablePhrases;
});

$('.add-phrase').keyup(function(event) {
    var text = $(this).val();
    matches = [];

    // Loop through phrases to display matches
    var subStr = new RegExp(text);

    if (text !== '') {
        var phrase;
        var matchList = '';
        for (var i = 0; i < phrases.length; i++) {
            phrase = phrases[i];
            if (subStr.test(phrase) & matches.indexOf(text) === -1) {
                matches.push(phrase);
                if (phrase.length > 0) {
                matchList = matchList + '<li>'+phrase+'</li>';
                }
            }
        }
        $('.matches').html(matchList);
    } else {
        $('.matches').html('');
    }

    // If user hits enter key
    if (event.keyCode == 13) {
        if (phrases.indexOf(text) > -1) {
            $('.input').before('<li>'+text+'</li>');
            remixedSOTU.push(text);
            matches = [];
            matchList = '';
            $(this).val('');
            console.log('The speech: ' , remixedSOTU);
        }
    }

    if( event.keyCode == 8 ) {
        console.log('BACKSPACE');
        if (text === '' && $('.input').prev('li')[0] && (lastKey == 8 || lastKey == 13)) {
            $('.input').prev('li')[0].remove();
            remixedSOTU = remixedSOTU.splice(-1,1);

        }
    }

    lastKey = event.keyCode;

});

var videoPlayer = new VideoPlayer($('#videoContainer'));
videoPlayer.setClipsDirectory('./clips/');

$('#vamanos').on('click', function () {
    videoPlayer.load(remixedSOTU);
    videoPlayer.playWhenReady();
});
