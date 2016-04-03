$(function() {

    // Begin starting the timer now that the puzzle has been selected.
    var initializeTimer = function() {

        var bar = $('#tool-bar').show();
        var display = bar.find('#timer').find('span');

        var minutes = 0;
        var seconds = 0;
        var format = function(value) {
            var prepend = (value < 10) ? "0" : "";
            return prepend + value;
        }

        // When the puzzle is completed, we disable this interval ID
        window.puzzle.intervalId = setInterval(function() {
            seconds += 1;
            if(seconds === 60) {
                minutes += 1;
                seconds = 0;
            }
            display.text(format(minutes) + ":" + format(seconds));
        }, 1000);
    };

    // Do not allow for selection of any other puzzles
    // In particular, load up the shuffled puzzle into the canvas
    var initializePuzzle = function(config) {
        $('#level-select-container').hide();
        $('#board').css('display', 'block');
        window.puzzle.load(config);
    };

    // Allow selection of the puzzle to work with. We simply take the image in
    // question and remove the other puzzle images in place of a canvas with the
    // background set to the selected image to scramble.
    $('.puzzle-img').click(function() {
        var that = $(this);
        initializeTimer();
        initializePuzzle({
            image: this,
            difficulty: window.puzzle.Difficulty.EASY
        });
    });

});
