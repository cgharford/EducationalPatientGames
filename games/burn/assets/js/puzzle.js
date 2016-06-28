$(function() {

    // This is the user's current score. It simply records the number of seconds
    // that have passed since selecting a level
    var score = 0;
    var selectedLanguage;

    // Global audio element. We use just the one to truncate any audio playing
    // when anothe raudio clip should be played
    window.audioElement = document.createElement('audio');

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
        $('#puzzle-select-container').hide();
        $('#puzzle-instructions-english').hide();
        $('#puzzle-instructions-spanish').hide();
        $('.img-container').find('img').hide();
        $('#level-select-container').hide();
        $('#level-instructions-english').hide();
        $('#level-instructions-spanish').hide();
        $('#puzzle-container').hide();
        $('#click-puzzle').hide();
        $('#click-instructions-english').hide();
        $('#click-instructions-spanish').hide();
        $('#easy-english').hide();
        $('#easy-spanish').hide();
        $('#medium-english').hide();
        $('#medium-spanish').hide();
        $('#hard-english').hide();
        $('#hard-spanish').hide();
        $('#insane-english').hide();
        $('#insane-spanish').hide();
        $('#nightmare-english').hide();
        $('#nightmare-spanish').hide();

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
            if (selectedLanguage == "english") {
                $('.instructions').text("Not quite...keep looking!");
            }
            else {
                $('.instructions').text("Spanish Not quite...keep looking!");
            }
            audioElement.setAttribute('src', './assets/audio/unsuccessfulTry.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener('load', function() {
               audioElement.play();
            }, true);
        });

        var classes = ['fireplace', 'lamp', 'matches', 'outlet', 'stove'];
        var instructionsEnglish = [
            "Great job! Make sure you keep your distance from any fireplaces.",
            "You're right! Clothes don't belong on hot lamps.",
            "Fantastic! Let adults handle the matches.",
            "Nice one! Excercise caution when plugging into outlets.",
            "Well done! Be careful around stoves and exposed handles."
        ];
        var instructionsSpanish = [
            "Spanish Great job! Make sure you keep your distance from any fireplaces.",
            "Spanish You're right! Clothes don't belong on hot lamps.",
            "Spanish Fantastic! Let adults handle the matches.",
            "Spanish Nice one! Excercise caution when plugging into outlets.",
            "Spanish Well done! Be careful around stoves and exposed handles."
        ];

        // Load in audio related to finishing game when user clicks correct spot
        correctClick = function(e, instr, src) {
            e.preventDefault();
            $('.instructions').text(instr);
            audioElement.setAttribute('src', './assets/audio/' + src + '.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener('load', function() {
                audioElement.play();
            }, true);
            audioElement.addEventListener('ended', function() {
                document.getElementById('tableLink').click();
                writeTable(score, window.board);
            });
        }

        // Switch over to scoring now that the user has selected the correct spot
        for(var i = 0; i < classes.length; i++) {
            +function() {
                var src = classes[i];
                var instr;
                if (selectedLanguage == english) {
                    instr = instructionsEnglish[i];
                }
                else {
                    instr = instructionsSpanish[i];
                }

                $('.' + classes[i] + '-correct').click(function(e) {
                    correctClick(e, instr, src);
                });

                $('#skipClick').click(function(e) {
                    window.wroteScoreboard = true;
                    correctClick(e, instr, src);
                });
            }();
        }

    }();

    // Puzzle and level selection
    +function() {

        // The puzzle selected and to be displayed after level selection
        var selectedPuzzle = undefined;

        // Allow selection of the langauge to work with. We then set the language
        // and allow selection for the puzzle
        $('.language-button').click(function() {

            selectedLanguage = $(this).data('content');
            $('#puzzle-select-container').show();
            $('#puzzle-instructions-' + selectedLanguage).show();
            $('#language-select-container').hide();

        });

        // Allow selection of the puzzle to work with. We then query the difficulty
        // of the puzzle
        $('.puzzle-img').click(function() {

            selectedPuzzle = $(this);
            $('#level-select-container').show();
            $('#level-instructions-' + selectedLanguage).show();
            $('#easy-' + selectedLanguage).show();
            $('#medium-' + selectedLanguage).show();
            $('#hard-' + selectedLanguage).show();
            $('#insane-' + selectedLanguage).show();
            $('#nightmare-' + selectedLanguage).show();
            $('#puzzle-select-container').hide();

            audioElement.setAttribute('src', './assets/audio/levelIntro.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener('load', function() {
               audioElement.play();
            }, true);

        });

        // Allow selection of the puzzle to work with
        // We simply take the image in question and remove the other puzzle images
        // in place of a canvas with the background set to the selected image to
        // scramble.
        $('.level-button').click(function() {

            var that = $(this);
            var puzzleName = selectedPuzzle.data('content');
            var puzzle_container = $('#puzzle-container').show();

            // When the puzzle is completed, we disable this interval ID
            var display = $('#tool-bar').show().find('#timer').find('span');
            window.board.intervalId = setInterval(function() {
                score += 1;
                display.text(window.formatScore(score));
            }, 1000);

            // Setup up completion callback
            var callback = function() {

                // Stop timer to fix our score
                clearInterval(window.board.intervalId);

                // Some notification that the puzzle is complete
                audioElement.setAttribute('src', './assets/audio/clickIntro.mp3');
                audioElement.setAttribute('autoplay', 'autoplay');
                audioElement.addEventListener('load', function() {
                   audioElement.play();
                }, true);

                // Switch to selection portion of game
                $('#board').hide();
                puzzle_container.hide();
                $('#click-puzzle').show();
                $('#click-instructions-' + selectedLanguage).show();
                $('#' + puzzleName + '-img').show();
                $('#' + puzzleName + '-img-anim').show();
                that.hide();

                // Setup responsive image map
                $('img[usemap]').rwdImageMaps();

            };

            // Play audio for puzzle instructions
            // Do not allow for selection of any other puzzles
            // In particular, load up the shuffled puzzle into the canvas
            $('#level-select-container').hide();
            $('#board').css('display', 'block');
            window.board.load({
                image: selectedPuzzle.get(0),
                dimension: that.data('level'),
                difficulty: that.data('content'),
                puzzleName: selectedPuzzle.data('content'),
                completed: callback
            });

            $('#skip').click(callback);

            // Play audio for puzzle instructions
            audioElement.setAttribute('src', './assets/audio/puzzleIntro.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener('load', function() {
               audioElement.play();
            }, true);


        });

    }();
});

function testTesters () {
    return "Test Worked!";
}
