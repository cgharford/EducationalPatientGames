$(function() {

    var audioElement = document.createElement('audio');

    // Preliminary setup. Hide elements and instruct user on how to begin playing
    // the game.
    +function() {

        $('.popup-with-form').magnificPopup({
         type: 'inline',
         preloader: false,
         focus: '#name',
         closeOnContentClick: false,
         showCloseBtn: false,
         closeOnBgClick: false,

         // When element is focused, some mobile browsers in some cases zoom in
         // It doesn't look nice so we disable it:
         callbacks: {
             beforeOpen: function() {
                 if($(window).width() < 700) {
                     this.st.focus = false;
                 } else {
                     this.st.focus = '#name';
                 }
             }
          }
        });

        // Hide all components beforehand
        $('#fireplace-img').hide();
        $('#lamp-img').hide();
        $('#matches-img').hide();
        $('#outlet-img').hide();
        $('#stove-img').hide();
        $('#fireplace-img-anim').hide();
        $('#lamp-img-anim').hide();
        $('#matches-img-anim').hide();
        $('#outlet-img-anim').hide();
        $('#stove-img-anim').hide();
        $('#click-puzzle').hide();
        $('#level-select-container').hide();
        $('#puzzle-container').hide();

        // Create audio element and instruct user to pick a puzzle
        audioElement.setAttribute('src', './assets/audio/choosePuzzle.mp3');
        audioElement.setAttribute('autoplay', 'autoplay');
        audioElement.addEventListener("load", function() {
           audioElement.play();
        }, true);

    }();

    // Preparations for when the puzzle is completed. This allows for selecting certain
    // parts of the image (once the puzzle is constructed) and identifying the problematic
    // regions of the puzzles. Also launches our scoreboard.
    +function() {

        $('.finished-img').click(function(e) {
            $('.instructions').text("Not quite...keep looking!");
            audioElement.setAttribute('src', './assets/audio/unsuccessfulTry.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);
        });

        $('.fireplace-correct').click(function(e) {
            e.preventDefault();
            $('.instructions').text("Great job! Make sure you keep your distance from any fireplaces.");
            audioElement.setAttribute('src', './assets/audio/fireplace.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);
            audioElement.addEventListener('ended', function(){
                document.getElementById('tableLink').click();
            });
        });

        $('.lamp-correct').click(function(e) {
            e.preventDefault();
            $('.instructions').text("You're right! Clothes don't belong on hot lamps.");
            audioElement.setAttribute('src', './assets/audio/lamp.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);
            audioElement.addEventListener('ended', function(){
                document.getElementById('tableLink').click();
            });
        });

        $('.matches-correct').click(function(e) {
            e.preventDefault();
            $('.instructions').text("Fantastic! Let adults handle the matches. ");
            audioElement.setAttribute('src', './assets/audio/matches.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);
            audioElement.addEventListener('ended', function(){
                document.getElementById('tableLink').click();
            });
        });

        $('.outlet-correct').click(function(e) {
            e.preventDefault();
            $('.instructions').text("Nice one! Excercise caution when plugging into outlets.");
            audioElement.setAttribute('src', './assets/audio/outlets.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);
            audioElement.addEventListener('ended', function(){
                document.getElementById('tableLink').click();
            });
        });

        $('.stove-correct').click(function(e) {
            e.preventDefault();
            $('.instructions').text("Well done! Be careful around stoves and exposed handles.");
            audioElement.setAttribute('src', './assets/audio/stove.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);
            audioElement.addEventListener('ended', function(){
                document.getElementById('tableLink').click();
            });
        });

    }();

    // Puzzle and level selection
    +function() {

        // The puzzle selected and to be displayed after level selection
        var selectedPuzzle = undefined;

        // Allow selection of the puzzle to work with. We then query the difficulty
        // of the puzzle
        $('.puzzle-img').click(function() {

            selectedPuzzle = $(this);
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

            var that = $(this);

            // Play audio for puzzle instructions
            audioElement.setAttribute('src', './assets/audio/puzzleIntro.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);

            // Initialize the timer
            // Begin starting the timer now that the puzzle has been selected.
            +function() {

                $('#puzzle-container').show();
                var bar = $('#tool-bar');
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

            }();

            // Do not allow for selection of any other puzzles
            // In particular, load up the shuffled puzzle into the canvas
            +function() {
                $('#level-select-container').hide();
                $('#board').css('display', 'block');
                window.puzzle.load({
                    image: selectedPuzzle.get(0),
                    dimension: that.data('level'),
                    completed: function() {

                        alert("Good Job!");

                        $('#puzzle-container').hide();
                        $('#board').hide();
                        $('#click-puzzle').show();
                        $('#' + selectedPuzzle.data('content') + '-img-anim').show();
                        $('#' + selectedPuzzle.data('content') + '-img').show();
                        $(this).hide();

                        // Setup responsive image map
                        $('img[usemap]').rwdImageMaps();
                    }
                });
            }();
        });

    }();

});
