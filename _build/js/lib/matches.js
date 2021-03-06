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
                this.match.eq(0).addClass('selected');
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
        if (inputText && inputText !== '') {
            this.html = '';
            var phrase;
            var foundMatch = false;

            for (var i = 0; i < phrases.length; i++) {
                if (inputText.test(phrases[i].toLowerCase()) && this.matchList.indexOf(inputText) === -1 && phrases[i].length > 0) {
                    phrase = phrases[i];
                    foundMatch = true;
                    this.matchList.push(phrase);
                }
            }

            this.matchList.sort(function(a, b){
                var a = a.toLowerCase();
                var b = b.toLowerCase();
                if (a.length == b.length) {
                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                }
                return a.length - b.length;
            });

            for (var i = 0; i < this.matchList.length; i++) {
                var phrase = this.matchList[i];
                if (this.checkSelected(phrase) === true) {
                    this.html = this.html + '<li class="match selected">'+phrase+'</li>';
                } else {
                    this.html = this.html + '<li class="match">'+phrase+'</li>';
                }
            }

            // If there is only one match, select it.
            if (this.matchList.length === 1) {
                this.html = '<li class="match selected">'+phrase+'</li>';
                this.selectedMatch = $('.match.selected');
            }
            $('.matches').html(this.html);

            if (!foundMatch) {
                $('.matches').addClass('empty');
            } else {
                $('.matches').removeClass('empty');
            }
        } else {
            this.clearMatches();
        }
    },
    clearMatches: function() {
        this.matchList = [];
        $('.matches').html('');
        $('.matches').addClass('empty');
        this.selectedMatch = $('.match.selected');
        this.selectedMatchText = '';
    }
};

module.exports = matches;