$(function() {

    var audioElement = document.createElement('audio');

    // Preliminary setup. Hide elements and instruct user on how to begin playing
    // the game.
    +function() {

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

            }();

            // Do not allow for selection of any other puzzles
            // In particular, load up the shuffled puzzle into the canvas
            +function() {
                $('#level-select-container').hide();
                $('#board').css('display', 'block');
                window.puzzle.load({
                    image: selectedPuzzle.get(0),
                    difficulty: that.data('level')
                });
            }();
        });

        // This is a temporary method to demonstrate code
        $('#skip').click(function() {
            $('#puzzle-container').hide();
            $('#board').hide();
            $('#click-puzzle').show();
            $('#' + selectedPuzzle.data('content') + '-img-anim').show();
            $('#' + selectedPuzzle.data('content') + '-img').show();
            $(this).hide();

            // Setup responsive image map
            $('img[usemap]').rwdImageMaps();
        });

    }();

    // Preparations for when the puzzle is completed. This allows for selecting certain
    // parts of the image (once the puzzle is constructed) and identifying the problematic
    // regions of the puzzles
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
        });

        $('.lamp-correct').click(function(e) {
            e.preventDefault();
            $('.instructions').text("You're right! Clothes don't belong on hot lamps.");
            audioElement.setAttribute('src', './assets/audio/lamp.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);
        });

        $('.matches-correct').click(function(e) {
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

        $('.stove-correct').click(function(e) {
            e.preventDefault();
            $('.instructions').text("Well done! Be careful around stoves and exposed handles.");
            audioElement.setAttribute('src', './assets/audio/stove.mp3');
            audioElement.setAttribute('autoplay', 'autoplay');
            audioElement.addEventListener("load", function() {
               audioElement.play();
            }, true);
        });

    }();

/*
    +function() {
        //get the cookie for high scores.
    responseArray = [];

    /* Send a POST request to the high score database
     * Returns a pipe-delimeted string of the top 5 scores (in order)
     * (ex: 2000|1000|750|565|20)
     */
/*        $.ajax({
            type: 'POST',
            url: "./db-api/savescores.php",
            data: "game=fire&score=" + score,
            dataType: "text",
            success: function(data, status) {
                response = data;
                console.log("Data: " + data + "\nStatus: " + status);
            },
            async: false
        });
    // Split the XHR response if it was successfully received
        try {
            responseArray = (response).split("|");
        } catch (e) { // Otherwise, follow built-in error handling procedure
            responseArray = [score, -1, -1, -1];
        }

        if(responseArray[0] == undefined || responseArray == "NULL") {
            responseArray[0] = score;
        }
        if(responseArray[1] == undefined || responseArray == "NULL") {
            responseArray[1] = -1;
        }
        if(responseArray[2] == undefined || responseArray == "NULL") {
            responseArray[2] = -1;
        }
        if(responseArray[3] == undefined || responseArray == "NULL") {
            responseArray[3] = -1;
        }


        //VICTORY SCREEN - NEED TO TALK
        var victoryBg = this.add.sprite(this.game.width, this.game.height, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        //universal styling
        textStyle = {
            font: "48px Arial",
            fill: "#ffffff",
            align: "center"*/
//        };

    //Display the 4 highest scores that were pulled from the database.
        // If the scores didn't make it to the client for some reason, just display the user's current score.
        /*scores0 = this.game.add.text(11 * this.game.width / 20, 6.5 * this.game.height / 20, (responseArray[0] + " points").trim(), textStyle);
        scores0.visible = true;
        // Load up the high scores, but don't display them yet.
        scores1 = this.game.add.text(11 * this.game.width / 20, 8 * this.game.height / 20, responseArray[1] + " points", textStyle);
        scores2 = this.game.add.text(11 * this.game.width / 20, 9.5 * this.game.height / 20, responseArray[2] + " points", textStyle);
        scores3 = this.game.add.text(11 * this.game.width / 20, 11 * this.game.height / 20, responseArray[3] + " points", textStyle);
        scores1.visible = false;
        scores2.visible = false;
        scores3.visible = false;*/

        //Display the high scores iff they made it back successfully and weren't equal to NULL
        /*if(responseArray[1] > 0) {
            scores1.visible = true;
        }
        if(responseArray[2] > 0) {
            scores2.visible = true;
        }
        if(responseArray[3] > 0) {
            scores3.visible = true;
        }*/

    // Show the user his/her score at the bottom of the results page
        //this.game.add.text(this.game.width / 2 - 275, 6 * this.game.height / 7, "Your Score:       " + score + " points!", {font: "bold 60px Arial", fill:"#ffffff"})

});
