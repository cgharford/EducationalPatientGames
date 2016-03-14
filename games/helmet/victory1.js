module.exports = {
    /**
  *Victory1 class. The victory1 object, final state of the game
  
  *@class victory1
  
  */

    /**
     * phaser create function  -- initializes the victory state, initialize victory image, text messages, and scores. Starts spawners. Creates 
     * @method create
     * @return 
     */
    create: function() {
        //get the cookie for high scores.
    /* Deprecated - Get high score data from cookies - Deprecated */  
        //highScores = Cookies.getJSON('high_scores_game2');
        responseArray = [];
    /* Send a POST request to the high score database
     * Returns a pipe-delimeted string of the top 5 scores (in order)
     * (ex: 2000|1000|750|565|20)
     */
        $.ajax({
            type: 'POST',
            url: "./db-api/savescores.php",
            data: "game=helmet&score=" + score,
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


        var victoryBg = this.add.sprite(this.game.width, this.game.height, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        //replay button
        var replayButton = this.game.add.sprite(513, 63, 'replay button');
        replayButton.x = (944 * this.game.width / 1024) - 513;
        replayButton.y = (590 * this.game.height / 768) - 63;
        replayButton.inputEnabled = true;

        textStyle = {
            font: "48px Arial",
            fill: "#ffffff",
            align: "center"
        };

    // Deprecated 
        // var yourScore = this.game.add.text(431, 172, score + " points", textStyle);
        // yourScore.x = 12 * this.game.width / 20;
        // yourScore.y = 6.5 * this.game.height / 20;
        // yourScore.visible = true;
    // End Deprecated Code

    //Display the 4 highest scores that were pulled from the database.
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

        //add an input function to the replay menut to send back to the wrapper
        replayButton.events.onInputDown.add(this.restart, this);

    /* Deprecated - high scores using cookies - Deprecated */
        //push out the lowest score.
        // highScores.push(score);
        // highScores.sort();
        // highScores.splice(0, 1);
        // //store the three highest scores
        // Cookies.set('high_scores_game2', highScores);
    },

    restart: function() {
        this.game.state.start('Wrapper');
    }
};
