var matches = {
    matchList: [],
    html: '',
    match: $('.match'),
    newMatch: '',
    prevMatch: '',
    selectedMatch: '',
    selectedMatchText: '',
    selectMatch: function(direction) {
        this.selectedMatch = $('.match.selected');
        this.match = $('.match');

        if (this.selectedMatch.length > 0) {
            this.selectedMatch.removeClass('selected');

            if (direction === 'prev') {
                this.prevMatch = this.selectedMatch.prev();
            } else {
                this.prevMatch = this.selectedMatch.next();
            }

            if (this.prevMatch.length > 0) {
                this.prevMatch.addClass('selected');
                this.selectedMatch = this.prevMatch.eq(0);
                this.selectedMatchText = this.prevMatch.eq(0).text();
            } else {
                this.selectedMatch = this.match.eq(0);
                this.selectedMatchText = this.match.eq(0).text();
                match.eq(0).addClass('selected');
            }

        } else {
            this.selectedMatch = this.match.eq(0);
            this.selectedMatchText = this.match.eq(0).text();
            this.match.eq(0).addClass('selected');
        }
    },
    checkSelected: function(phrase) {
        if (this.selectedMatchText === phrase) {
            return true;
        }
    },
    findMatches: function(inputText, phrases) {
        console.log('looking for matches');
        if (inputText !== '') {
            this.html = '';
            for (var i = 0; i < phrases.length; i++) {
                phrase = phrases[i];
                if (inputText.test(phrase) & this.matchList.indexOf(inputText) === -1) {
                    this.matchList.push(phrase);

                    if (phrase.length > 0) {
                        if (this.checkSelected(phrase) === true) {
                            this.html = this.html + '<li class="match selected">'+phrase+'</li>';
                        } else {
                            this.html = this.html + '<li class="match">'+phrase+'</li>';
                        }
                    }

                }
            }
            $('.matches').html(this.html);
        } else {
            $('.matches').html('');
        }
    }
};

module.exports = matches;