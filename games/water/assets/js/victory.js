(function() {

    window.victory = function(game) {

    };

    window.victory.prototype = {

        create: function() {

            responseArray = [];

            /* Send a POST request to the high score database
             * Returns a pipe-delimeted string of the top 5 scores (in order)
             * (ex: 2000|1000|750|565|20)
            */
            $.ajax({
                type: 'POST',
                url: "./db-api/savescores.php",
                data: "game=water&score=" + score,
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


            // Background of the victory screen
            var victoryBg = this.add.sprite(this.game.width, this.game.height, 'victory');
            victoryBg.x = 0;
            victoryBg.y = 0;
            victoryBg.height = this.game.height;
            victoryBg.width = this.game.width;

            // Replay button
            var replayButton = this.game.add.sprite(513, 63, 'replay_button');
            replayButton.x = (944 * this.game.width / 1024) - 513;
            replayButton.y = (590 * this.game.height / 768) - 63;
            replayButton.inputEnabled = true;

            // Universal styling
            textStyle = {
                font: "48px Arial",
                fill: "#ffffff",
                align: "center"
            };

            // Display the 4 highest scores that were pulled from the database.
            // If the scores didn't make it to the client for some reason, just display the user's current score.
            scores0 = this.game.add.text(11 * this.game.width / 20, 6.5 * this.game.height / 20, (responseArray[0] + " points").trim(), textStyle);
            scores0.visible = true;

            // Load up the high scores, but don't display them yet. 
            scores1 = this.game.add.text(11 * this.game.width / 20, 8 * this.game.height / 20, responseArray[1] + " points", textStyle);
            scores2 = this.game.add.text(11 * this.game.width / 20, 9.5 * this.game.height / 20, responseArray[2] + " points", textStyle);
            scores3 = this.game.add.text(11 * this.game.width / 20, 11 * this.game.height / 20, responseArray[3] + " points", textStyle);
            scores1.visible = false;
            scores2.visible = false;
            scores3.visible = false;

            //Display the high scores iff they made it back successfully and weren't equal to NULL
            if(responseArray[1] > 0) {
                scores1.visible = true;
            }
            if(responseArray[2] > 0) {
                scores2.visible = true;
            }
            if(responseArray[3] > 0) {
                scores3.visible = true;
            }

            // Show the user his/her score at the bottom of the results page
            this.game.add.text(this.game.width / 2 - 275, 6 * this.game.height / 7, "Your Score:       " + score + " points!", {font: "bold 60px Arial", fill:"#ffffff"})

            // Add an input function to the replay menut to send back to the wrapper
            replayButton.events.onInputDown.add(this.restart, this);

        },

        //move to state wrapper.
        restart: function() {
            location.href = '/';
        }

    };

})();
