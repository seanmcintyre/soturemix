var Matches = require('./matches');

var theSpeech = {
    text: [],
    addPhrase: function(phrase) {
        $('.speech').append('<li class="phrase">'+phrase+'</li>');
        this.text.push(phrase);
        Matches.clearMatches();
        $('.phrase-search').val('');
    },
    removeLastPhrase: function(inputText, lastKey) {
        // if (inputText === '' && $('.input').prev('li')[0] && (lastKey == 8 || lastKey == 13)) {
        //     $('.input').prev('li')[0].remove();
        //     this.text = this.text.slice(0,-1);
        // }
        if (inputText === '' && $('.phrase').last() && (lastKey == 8 || lastKey == 13)) {
            $('.phrase').last().remove();
            this.text = this.text.slice(0,-1);
        }
    }
};

window.theSpeech = theSpeech;
module.exports = theSpeech;