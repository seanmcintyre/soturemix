var theSpeech = {
    text: [],
    addPhrase: function(phrase) {
        $('.input').before('<li>'+phrase+'</li>');
        this.text.push(phrase);
        matches = [];
        matchList = '';
        $('.matches').html(matchList);
        $('.add-phrase').val('');
        console.log(this.text);
    },
    removeLastPhrase: function(inputText, lastKey) {
        if (inputText === '' && $('.input').prev('li')[0] && (lastKey == 8 || lastKey == 13)) {
            $('.input').prev('li')[0].remove();
            this.text = this.text.slice(0,-1);
        }
    }
};

module.exports = theSpeech;