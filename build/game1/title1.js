module.exports = {
	  /**
  *title1 class. The title1 object, just displays title screen
  
  *@class title1
  */
  
     /**
     * phaser create function  -- initializes the title state, displays title screen and play button.
     * @method create
     * @return 
     */
    create: function() {
        var titleBg = this.add.sprite(this.game.width, this.game.height, 'title page bg');
        titleBg.x = 0;
        titleBg.y = 0;
        titleBg.height = this.game.height;
        titleBg.width = this.game.width;

        var playButton = this.game.add.sprite(319, 160, 'play button');
        playButton.x = this.game.width - 319;
        playButton.y = this.game.height - 160;
        playButton.inputEnabled = true;

        playButton.events.onInputDown.add(this.playGame,this);

       
    },
	
	   /**
     * playGame function that begins the gameplay state Game1
     * @method playGame
     * @return 
     */
    playGame: function() {
        this.game.state.start("Game1");
    }
};
