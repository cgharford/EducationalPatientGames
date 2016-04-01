$(function() {
    $('#fireplace-img').hide();
    // $('#lamp-img').hide();
    $('#matches-img').hide();
    $('#outlet-img').hide();
    $('#stove-img').hide();
    $('#level-select-container').hide();

    // Global reference
    window.puzzle = {};

    // Create audio element and instruct user to pick a puzzle
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', './assets/audio/choosePuzzle.mp3');
    audioElement.setAttribute('autoplay', 'autoplay');
    audioElement.addEventListener("load", function() {
       audioElement.play();
    }, true);

    $('.puzzle-img').click(function() {
        $('#puzzle-select-container').hide();
        $('#level-select-container').show();
        audioElement.setAttribute('src', './assets/audio/levelIntro.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);
    });

    // Allow selection of the puzzle to work with
    // We simply take the image in question and remove the other puzzle images
    // in place of a canvas with the background set to the selected image to
    // scramble.
    $('.level-button').click(function() {
        // Play audio for puzzle instructions
        audioElement.setAttribute('src', './assets/audio/puzzleIntro.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);

        var that = $(this);

        // Do not allow for selection of any other puzzles
        $('#level-select-container').hide();

        // FOR DEMO PURPOSES...REMOVE MEEEE
        $('#click-puzzle').show();
        audioElement.setAttribute('src', './assets/audio/clickIntro.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);


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

    $('.finished-img').click(function(e) {
        $('.instructions').text("Not quite...keep looking!");
        audioElement.setAttribute('src', './assets/audio/unsuccessfulTry.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);
    });

    $('#fireplace-correct').click(function(e) {
        e.preventDefault();
        $('.instructions').text("Great job! Make sure you keep your distance from any fireplaces.");
        audioElement.setAttribute('src', './assets/audio/fireplace.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);
    });

    $('#lamp-correct').click(function(e) {
        e.preventDefault();
        $('.instructions').text("You're right! Clothes don't belong on hot lamps.");
        audioElement.setAttribute('src', './assets/audio/lamp.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);
    });

    $('#matches-correct').click(function(e) {
        e.preventDefault();
        $('.instructions').text("Fantastic! Let adults handle the matches. ");
        audioElement.setAttribute('src', './assets/audio/matches.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);
    });

    $('.outlet-correct').click(function(e) {
        e.preventDefault();
        $('.instructions').text("Nice one! Excercise caution when plugging into outlets.");
        audioElement.setAttribute('src', './assets/audio/outlets.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);
    });

    $('#stove-correct').click(function(e) {
        e.preventDefault();
        $('.instructions').text("Well done! Be careful around stoves and exposed handles.");
        audioElement.setAttribute('src', './assets/audio/stove.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);
    });
});
