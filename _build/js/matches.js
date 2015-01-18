var matches = {
    matchList: [],
    html: '',
    match: $('.match'),
    newMatch: '',
    prevMatch: '',
    selectedMatct: '',
    selectedMatchText: '',
    selectPrevMatch: function() {
        this.selectedMatch = $('.match.selected');
        this.match = $('.match');

        if (this.selectedMatch.length > 0) {
            this.selectedMatch.removeClass('selected');
            this.prevMatch = this.selectedMatch.prev();

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
};

module.exports = matches;

var selectNextMatch = function() {
    selectedMatch = $('.match.selected');
    match = $('.match');

    if (selectedMatch.length > 0) {
        selectedMatch.removeClass('selected');
        nextMatch = selectedMatch.next();

        if (nextMatch.length > 0) {
            nextMatch.addClass('selected');
            selectedMatch = nextMatch.eq(0);
            selectedMatchText = nextMatch.eq(0).text();
        } else {
            selectedMatch = match.eq(0);
            selectedMatchText = match.eq(0).text();
            match.eq(0).addClass('selected');
        }

    } else {
        selectedMatch = match.eq(0);
        selectedMatchText = match.eq(0).text();
        match.eq(0).addClass('selected');
    }
};