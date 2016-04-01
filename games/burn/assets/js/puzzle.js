$(function() {

    // Global reference
    window.puzzle = {};

    // Allow selection of the puzzle to work with
    // We simply take the image in question and remove the other puzzle images
    // in place of a canvas with the background set to the selected image to
    // scramble.
    $('.puzzle-img').click(function() {
        var that = $(this);

        // Do not allow for selection of any other puzzles
        $('#level-select-container').hide();

        // Begin starting the timer now that the puzzle has been selected.
        +function() {

            var bar = $('#tool-bar').show();
            var display = bar.find('#timer').find('span');

            var minutes = 0;
            var seconds = 0;
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



});
