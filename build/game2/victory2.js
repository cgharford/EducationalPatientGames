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
    create: function () {

        var victoryBg = this.add.sprite(1024, 768, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        var replayButton = this.game.add.sprite(513, 63, 'replay button');
        replayButton.x = 12*this.game.width/20;
        replayButton.y = 14.5*this.game.height/20;
        replayButton.inputEnabled = true;

        textStyle = {font: "48px Arial", fill: "#ffffff", align: "center"};
        var yourScore = this.game.add.text(431, 172, score + " points", textStyle);
        yourScore.x = 12*this.game.width/20;
        yourScore.y = 6.5*this.game.height/20;
        yourScore.visible = true;
        //yourScore.anchor.set(0.5);
        //yourScore.setText("TEST");
        //yourScore.text = "TEST";
        scores1 = this.game.add.text(12*this.game.width/20, 8*this.game.height/20, "150 points", textStyle);
        scores1.visible = true;
        scores2 = this.game.add.text(12*this.game.width/20, 9.5*this.game.height/20, "80 point", textStyle);
        scores2.visible = true;
        scores3 = this.game.add.text(12*this.game.width/20, 11*this.game.height/20, "30 points", textStyle);
        scores3.visible = true;

	//Calls post and get methods
        try {
            this.game.globals.post("USR", score); //once users allowed to have login, will also store their username in the db
            //for now leave the userName field so it can easily scale later
            this.game.globals.get(this.game);
        }
        catch (err) {
            console.error(err);
        }

        replayButton.events.onInputDown.add(this.restart,this);
    },
    restart: function() {
        this.game.state.start('Title2');
    }
};