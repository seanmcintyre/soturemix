var $ = require('jquery-browserify');
var theSpeech = require('./theSpeech');
var DataManager = require('./lib/DataManager');
var VideoPlayer  = require('./lib/HTMLVideoPlayer');

// TODO
// No need to parse transcript into array in production.
// Do it once in development, and paste the array in statically.
// Array.prototype.unique = function() {
//     return this.reduce(function(accum, current) {
//         if (accum.indexOf(current) < 0) {
//             accum.push(current);
//         }
//         return accum;
//     }, []);
// };

var lastKey;

var phrases = []; // will be filled in by network call
var matches = [];
var match = $('.match');
var selectedMatch;
var selectedMatchText;
var newMatch;

var text;
var subStr;

DataManager.getAvailablePhrases(function (err, availablePhrases) {
    phrases = availablePhrases;
    // phrases = phrases.reduce(function(o, v, i) {
    //   o[v] = i+1;
    //   return o;
    // }, {});
    // var words = transcript.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase().split('-').unique();
    // var phrases = words;
});

$('.add-phrase').keyup(function(event) {
    text = $(this).val();
    matches = [];

    // Loop through phrases to display matches
    subStr = new RegExp(text);
    findMatches(subStr);

    // enter key
    if (event.keyCode == 13 && phrases.indexOf(text) > -1) {
        theSpeech.addPhrase(text);
    }
    if (event.keyCode == 13 && phrases.indexOf(text) == -1) {
        selectedMatch = $('.match.selected');
        selectedMatchText = selectedMatch.text();
        match = $('.match');
        theSpeech.addPhrase(selectedMatchText);
    }

    // backspace key
    if( event.keyCode == 8 ) {
        theSpeech.removeLastPhrase(text, lastKey);
    }
    // down/right arrow keys
    if (event.keyCode == 40 || event.keyCode == 39) {
        selectNextMatch();
    }
    // up/left arrow keys
    if (event.keyCode == 38 || event.keyCode == 37) {
        selectPrevMatch();
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

var findMatches = function(text) {
    if (text !== '') {
        var phrase;
        var matchList = '';
        for (var i = 0; i < phrases.length; i++) {
            phrase = phrases[i];
            if (subStr.test(phrase) & matches.indexOf(text) === -1) {
                matches.push(phrase);

                if (phrase.length > 0) {
                    if (checkSelected(phrase) === true) {
                        matchList = matchList + '<li class="match selected">'+phrase+'</li>';
                    } else {
                        matchList = matchList + '<li class="match">'+phrase+'</li>';
                    }
                }

            }
        }
        $('.matches').html(matchList);
    } else {
        $('.matches').html('');
    }
};

var checkSelected = function(phrase) {
    if (selectedMatchText === phrase) {
        return true;
    }
};

var selectNextMatch = function() {
    selectedMatch = $('.match.selected');
    match = $('.match');

    if (selectedMatch.length > 0) {
        selectedMatch.removeClass('selected');
        nextMatch = selectedMatch.next();

        if (nextMatch.length > 0) {
            nextMatch.addClass('selected');
            selectedMatch = nextMatch.eq(0);
            selectedMatchText = nextMatch.eq(0).text();
        } else {
            selectedMatch = match.eq(0);
            selectedMatchText = match.eq(0).text();
            match.eq(0).addClass('selected');
        }

    } else {
        selectedMatch = match.eq(0);
        selectedMatchText = match.eq(0).text();
        match.eq(0).addClass('selected');
    }
};

var selectPrevMatch = function() {
    selectedMatch = $('.match.selected');
    match = $('.match');

    if (selectedMatch.length > 0) {
        selectedMatch.removeClass('selected');
        prevMatch = selectedMatch.prev();

        if (prevMatch.length > 0) {
            prevMatch.addClass('selected');
            selectedMatch = prevMatch.eq(0);
            selectedMatchText = prevMatch.eq(0).text();
        } else {
            selectedMatch = match.eq(0);
            selectedMatchText = match.eq(0).text();
            match.eq(0).addClass('selected');
        }

    } else {
        selectedMatch = match.eq(0);
        selectedMatchText = match.eq(0).text();
        match.eq(0).addClass('selected');
    }
};

var videoPlayer = new VideoPlayer($('#videoContainer'));
videoPlayer.setClipsDirectory('./clips/');

$('#vamanos').on('click', function () {
    videoPlayer.load(theSpeech.text);
    videoPlayer.playWhenReady();
});
