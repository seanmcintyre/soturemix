var TheSpeech = require('./theSpeech');
var Matches = require('./matches');
var DataManager = require('./DataManager');
var videoPlayer = require('./video/VideoPlayer');
var isMobile = require('./isMobile');

var lastKey;
var phrases = []; // will be filled in by network call
var text;
var subStr;

DataManager.getClips(function (err, clips) {
    for (var i = 0; i < clips.length; i++) {
        phrases.push(clips[i].name);
    }
});

// try change event instead of keypress and compare values
function init () {
    $('.phrase-search').keyup(keyup);
    $('.matches').on('click', '.match', selectedMatch);
    $('.phrase-search').focus(focusSearch);
    $('body').bind("touchmove", didDrag);

    if (isMobile) {
        // There's no good way to specify the height between the input field and the mobile keyboard
        // Approximate it with viewportHeight * .5, then add gratuitous padding so that
        // nothing should be out of scrolling reach
        var viewportHeight = $(window).height();
        $('.matches').css({
            maxHeight: viewportHeight * .5,
            minHeight: viewportHeight * .5,
            paddingBottom: 100
        });
    }
}

function keyup (event) {
    text = $(this).val().toLowerCase();
    Matches.matchList = [];

    // Loop through phrases to display matches
    subStr = new RegExp(text.toLowerCase());
    Matches.findMatches(subStr, phrases);

    // enter key
    if (event.keyCode == 13 && phrases.indexOf(text) > -1) {
        TheSpeech.addPhrase(text);
    }
    if (event.keyCode == 13 && phrases.indexOf(text) == -1) {
        Matches.selectedMatchText = Matches.selectedMatch.text();
        TheSpeech.addPhrase(Matches.selectedMatchText);
    }
    // backspace key
    if( event.keyCode == 8 ) {
        TheSpeech.removeLastPhrase(text, lastKey);
        if (text.length == 0) {
            Matches.clearMatches();
        }
    }
    // down/right arrow keys
    if (event.keyCode == 40 || event.keyCode == 39) {
        event.preventDefault();
        Matches.selectMatch('next');
    }
    // up/left arrow keys
    if (event.keyCode == 38 || event.keyCode == 37) {
        event.preventDefault();
        Matches.selectMatch('prev');
    }
    // Backspace manager
    if (text.length == 0) {
        lastKey = event.keyCode;
    } else {
        lastKey = null;
    }
}

function selectedMatch () {
    TheSpeech.addPhrase($(this)[0].innerText);

    if (isMobile) {
        $('.phrase-search').focus();
    }
}

function focusSearch () {
    if (isMobile) {
        $(this).scrollTo();
    }
}

function didDrag (event) {
    var $target = $(event.target)
    if ($('.phrase-search').is(':focus') && !$target.hasClass('matches') && !$target.hasClass('match')) {
        event.preventDefault();
    }
}

module.exports = {
    init: init
};