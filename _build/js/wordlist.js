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


// TODO
// Disable linebreaks, and disable spacebar unless a matching word or
// phrase exists.  Enter and spacebar will autocomplete selected word.
// Allow spaces after periods.
$('textarea').keypress(function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
    } else if (event.keyCode == 32) {
        event.preventDefault();
    }
});

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