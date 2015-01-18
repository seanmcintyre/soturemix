var $ = require('jquery-browserify');
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
var remixedSOTU = [];

var phrases = []; // will be filled in by network call
var matches = [];
var match = $('.match');
var selectedMatch;
var nextMatch;

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

    if (text !== '') {
        var phrase;
        var matchList = '';
        for (var i = 0; i < phrases.length; i++) {
            phrase = phrases[i];
            if (subStr.test(phrase) & matches.indexOf(text) === -1) {
                matches.push(phrase);
                if (phrase.length > 0) {
                matchList = matchList + '<li class="match">'+phrase+'</li>';
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
            addPhrase(text);
        }
    }

    if( event.keyCode == 8 ) {
        console.log('BACKSPACE');
        if (text === '' && $('.input').prev('li')[0] && (lastKey == 8 || lastKey == 13)) {
            $('.input').prev('li')[0].remove();
            remixedSOTU = remixedSOTU.splice(-1,1);

        }
    }

    if (event.keyCode == 40) {
        selectedMatch = $('.match.selected');
        match = $('.match');

        console.log('---');
        console.log('down!');

        if (selectedMatch.length > 0) {
            console.log('selected');
            // selectedMatch.removeClass('selected');
            // nextMatch = selectedMatch.next();
            // if (nextMatch.length > 0) {
            //     selectedMatch = nextMatch.addClass('selected');
            // } else {
            //     selectedMatch = match.eq(0).addClass('selected');
            // }
        } else {
            console.log('selecting first item');
            selectedMatch = match.eq(0).addClass('selected');
        }

    }

    lastKey = event.keyCode;

});

$('.matches').on('click', '.match', function (){
    addPhrase($(this)[0].innerText);
});

var addPhrase = function(phrase) {
    $('.input').before('<li>'+phrase+'</li>');
    remixedSOTU.push(phrase);
    matches = [];
    matchList = '';
    console.log('The speech: ' , remixedSOTU);
    $('.add-phrase').val('');
}

var videoPlayer = new VideoPlayer($('#videoContainer'));
videoPlayer.setClipsDirectory('./clips/');

$('#vamanos').on('click', function () {
    videoPlayer.load(remixedSOTU);
    videoPlayer.playWhenReady();
});
