// TODO
// No need to parse transcript into array in production.
// Do it once in development, and paste the array in statically.
Array.prototype.unique = function() {
    return this.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
            accum.push(current);
        }
        return accum;
    }, []);
};
var words = transcript.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase().split('-').unique();

var phrases = ['this is', 'a funny', 'bone tired', 'day in america', 'a united people', 'iran', 'pizza', 'with', 'for', 'and', 'my', 'republican friends', 'tomorrow'];
phrases = phrases.reduce(function(o, v, i) {
  o[v] = i+1;
  return o;
}, {});

// Textarea autocompletion
$('textarea').textcomplete([
    {
        words: words,
        match: /\b(\w{1,})$/,
        search: function (term, callback) {
            callback($.map(this.words, function (word) {
                return word.indexOf(term) === 0 ? word : null;
            }));
        },
        index: 1,
        replace: function (word) {
            return word + ' ';
        }
    }
]);
// TAG IT (alternative)
// $('textarea').tagit({
//     availableTags: phrases
// });

var matches = [];
$('.add-phrase').keypress(function(event) {
    var text = $(this).val();
    var textAndKey = text + String.fromCharCode(event.keyCode);
    matches = [];

    // Loop through phrases to display matches
    var subStr = new RegExp(textAndKey);
    for (phrase in phrases) {
        if (subStr.test(phrase) & matches.indexOf(textAndKey) === -1) {
            matches.push(phrase);
            console.log(matches);
        }
    }
    $('.matches').text(matches);

    // If user hits enter key
    if (event.keyCode == 13) {
        if (phrases[text] > -1) {
            console.log('correct phrase! : ' + text);
            $('.test-two').prepend('<li>'+text+'</li>');
            matches = [];
        } else {
            console.log('not a phrase! : ' + text);
        }
    }
});


// TODO
// Disable linebreaks, and disable spacebar unless a matching word or
// phrase exists.  Enter and spacebar will autocomplete selected word.
// Allow spaces after periods.
var lastKeys = [0,0];
$('textarea').keypress(function(event) {
    lastKeys.push(event.keyCode);
    lastKeys.shift();
    console.log(lastKeys);
    if (event.keyCode == 13) {
        event.preventDefault();
    } else if (event.keyCode == 32 && lastKeys[0] != 46) {
        event.preventDefault();
    }
});

//
// completeOnSpace must be set to true in textcomplete.js
//

// TODO
// Make the textarea a little more magical
var scrollTop     = $(window).scrollTop(),
    elementOffset = $('textarea').offset().top,
    distance      = (elementOffset - scrollTop);

$('textarea').keyup(function(){
	var charRow = Math.ceil($('textarea').val().length/36),
			rows = (charRow > 1) ? charRow : 1,
			elementOffset = $('textarea').offset().top,
			distance      = (elementOffset - scrollTop)
  $('.charCount').text("Characters left: " + (200 - $('textarea').val().length));
  $('.cursor').css('top',$('textarea').textareaHelper('caretPos').top + distance);
});