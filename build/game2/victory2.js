module.exports = {
    /**
  *Victory2 class. The victory1 object, final state of the game
  
  *@class victory2
  
  */

    /**
     * phaser create function  -- initializes the victory state, initialize victory image, text messages, and scores. Starts spawners. Creates 
     * @method create
     * @return 
     */
    create: function() {
        //get the cookie for high scores.
        highScores = Cookies.getJSON('high_scores_game2');

        //background of the victory screen
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

        //universal styling
        textStyle = {
            font: "48px Arial",
            fill: "#ffffff",
            align: "center"
        };

        //The player's score for this game displayed on the screen
        var yourScore = this.game.add.text(431, 172, score + " points", textStyle);
        yourScore.x = 12 * this.game.width / 20;
        yourScore.y = 6.5 * this.game.height / 20;
        yourScore.visible = true;

        //Display the 3 highest scores that were given by the cookies.
        scores1 = this.game.add.text(12 * this.game.width / 20, 8 * this.game.height / 20, highScores[2] + " points", textStyle);
        scores1.visible = true;
        scores2 = this.game.add.text(12 * this.game.width / 20, 9.5 * this.game.height / 20, highScores[1] + " points", textStyle);
        scores2.visible = true;
        scores3 = this.game.add.text(12 * this.game.width / 20, 11 * this.game.height / 20, highScores[0] + " points", textStyle);
        scores3.visible = true;

        //add an input function to the replay menut to send back to the wrapper
        replayButton.events.onInputDown.add(this.restart, this);

        //push out the lowest score.
        highScores.push(score);
        highScores.sort();
        highScores.splice(0, 1);
        //store the three highest scores
        Cookies.set('high_scores_game2', highScores);
    },

    //move to state wrapper.
    restart: function() {
        this.game.state.start('Wrapper');
    }
};
