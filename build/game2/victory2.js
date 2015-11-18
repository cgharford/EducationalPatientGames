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
        highScores = Cookies.getJSON('high_scores_game2');
        //highScores = [150, 80, 10];
        var victoryBg = this.add.sprite(this.game.width, this.game.height, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        var replayButton = this.game.add.sprite(513, 63, 'replay button');
        replayButton.x = 12 * this.game.width / 20;
        replayButton.y = 14.5 * this.game.height / 20;
        replayButton.inputEnabled = true;

        textStyle = {
            font: "48px Arial",
            fill: "#ffffff",
            align: "center"
        };
        var yourScore = this.game.add.text(431, 172, score + " points", textStyle);
        yourScore.x = 12 * this.game.width / 20;
        yourScore.y = 6.5 * this.game.height / 20;
        yourScore.visible = true;


        scores1 = this.game.add.text(12 * this.game.width / 20, 8 * this.game.height / 20, highScores[2] + " points", textStyle);
        scores1.visible = true;
        scores2 = this.game.add.text(12 * this.game.width / 20, 9.5 * this.game.height / 20, highScores[1] + " points", textStyle);
        scores2.visible = true;
        scores3 = this.game.add.text(12 * this.game.width / 20, 11 * this.game.height / 20, highScores[0] + " points", textStyle);
        scores3.visible = true;

        replayButton.events.onInputDown.add(this.restart, this);
        highScores.push(score);
        highScores.sort();
        highScores.splice(0, 1);
        Cookies.set('high_scores_game2', highScores);
    },
    restart: function() {
        this.game.state.start('Wrapper');
    }
};
