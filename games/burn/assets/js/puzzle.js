$(function() {
	
	// This is the user's current score. It simply records the number of seconds
	// that have passed since selecting a level
	var score = 0;

	// Global audio element. We use just the one to truncate any audio playing
	// when another audio clip should be played
    var audioElement = document.createElement('audio');
   
    // Preliminary setup. Hide elements and instruct user on how to begin playing
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
        $('.img-container').find('img').hide();
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
            audioElement.addEventListener('load', function() {
               audioElement.play();
            }, true);
        });

        var classes = ['fireplace', 'lamp', 'matches', 'outlet', 'stove'];
        var instructions = [
            "Great job! Make sure you keep your distance from any fireplaces.",
            "You're right! Clothes don't belong on hot lamps.",
            "Fantastic! Let adults handle the matches.",
            "Nice one! Excercise caution when plugging into outlets.",
            "Well done! Be careful around stoves and exposed handles."
        ];

        // Switch over to scoring now that the user has selected the correct spot.
		// Load in audio related to finishing game
        for(var i = 0; i < classes.length; i++) {
            +function() {
                var src = classes[i];
                var instr = instructions[i];
                $('.' + classes[i] + '-correct').click(function(e) {
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

                });
            }();
        }

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

            // Do not allow for selection of any other puzzles
            // In particular, load up the shuffled puzzle into the canvas
			$('#level-select-container').hide();
			$('#board').css('display', 'block');
			window.board.load({
				image: selectedPuzzle.get(0),
				dimension: that.data('level'),
				difficulty: that.data('content'),
				puzzleName: selectedPuzzle.data('content'),
				completed: function() {
					
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
					$('#' + puzzleName + '-img').show();
					$('#' + puzzleName + '-img-anim').show();

					// Setup responsive image map
					$('img[usemap]').rwdImageMaps();

				}
			});
			
			// Play audio for puzzle instructions
            audioElement.setAttribute('src', './assets/audio/puzzleIntro.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener('load', function() {
               audioElement.play();
            }, true);
        });

    }();

});
