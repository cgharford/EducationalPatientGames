$(function() {

    // Global reference
    window.puzzle = {};

    // Perform changes to the timer
    +function() {

        var minutes = 0;
        var seconds = 0;
        var display = $('#timer').find('span');

        var format = function(value) {
            var prepend = (value < 10) ? "0" : "";
            return prepend + value;
        }

        window.puzzle.intervalId = setInterval(function() {
            seconds += 1;
            if(seconds === 60) {
                minutes += 1;
                seconds = 0;
            }
            display.text(format(minutes) + ":" + format(seconds));
        }, 1000);

    }();

});
