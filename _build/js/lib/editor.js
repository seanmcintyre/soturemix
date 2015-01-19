var TheSpeech = require('./theSpeech');
var Matches = require('./matches');
var DataManager = require('./DataManager');

var lastKey;
var phrases = []; // will be filled in by network call
var text;
var subStr;

DataManager.getAvailablePhrases(function (err, availablePhrases) {
    phrases = availablePhrases;
});

function init () {
    $('.phrase-search').keyup(function(event) {
        text = $(this).val();
        Matches.matchList = [];

        // Loop through phrases to display matches
        subStr = new RegExp(text);
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
    });

    $('.matches').on('click', '.match', function (){
        TheSpeech.addPhrase($(this)[0].innerText);
    });
}

module.exports = {
    init: init
};