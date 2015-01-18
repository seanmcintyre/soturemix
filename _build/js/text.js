var $ = require('jquery-browserify');

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
// var words = transcript.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase().split('-').unique();

var phrases = ['this is', 'a funny', 'bone tired', 'day in america', 'a united people', 'iran', 'pizza', 'with', 'for', 'and', 'my', 'republican friends', 'tomorrow'];
// phrases = phrases.reduce(function(o, v, i) {
//   o[v] = i+1;
//   return o;
// }, {});

//var phrases = words;

var matches = [];
var lastKey;
var remixedSOTU = [];

$('.add-phrase').keyup(function(event) {
    var text = $(this).val();
    matches = [];

    // Loop through phrases to display matches
    var subStr = new RegExp(text);

    if (text != '') {
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
            $(this).val('')
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